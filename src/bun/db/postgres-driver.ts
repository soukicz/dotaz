import { SQL } from "bun";
import type { ReservedSQL } from "bun";
import type { DatabaseDriver } from "./driver";
import type { ConnectionConfig } from "../../shared/types/connection";
import type { QueryResult, QueryResultColumn } from "../../shared/types/query";
import type {
	SchemaInfo,
	SchemaData,
	TableInfo,
	ColumnInfo,
	IndexInfo,
	ForeignKeyInfo,
	ReferencingForeignKeyInfo,
} from "../../shared/types/database";

export class PostgresDriver implements DatabaseDriver {
	private db: SQL | null = null;
	private connected = false;
	private txActive = false;
	private reservedConn: ReservedSQL | null = null;
	private activeQuery: ReturnType<SQL["unsafe"]> | null = null;

	async connect(config: ConnectionConfig): Promise<void> {
		if (config.type !== "postgresql") {
			throw new Error(
				"PostgresDriver requires a postgresql connection config",
			);
		}
		const sslParam = config.ssl ? `?sslmode=${config.ssl}` : "";
		const url = `postgres://${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${encodeURIComponent(config.database)}${sslParam}`;
		this.db = new SQL({ url });
		// Verify the connection works
		await this.db`SELECT 1`;
		this.connected = true;
	}

	async disconnect(): Promise<void> {
		if (this.reservedConn) {
			this.reservedConn.release();
			this.reservedConn = null;
		}
		if (this.db) {
			await this.db.close();
			this.db = null;
			this.connected = false;
			this.txActive = false;
		}
	}

	isConnected(): boolean {
		return this.connected;
	}

	async execute(sql: string, params?: unknown[]): Promise<QueryResult> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const start = performance.now();
		const query = conn.unsafe(sql, params ?? []);
		this.activeQuery = query;
		try {
			const result = await query;
			const durationMs = Math.round(performance.now() - start);
			const rows = [...result] as Record<string, unknown>[];

			const columns: QueryResultColumn[] =
				rows.length > 0
					? Object.keys(rows[0]).map((name) => ({
							name,
							dataType: "unknown",
						}))
					: [];

			return {
				columns,
				rows,
				rowCount: rows.length,
				affectedRows: (result as any).count ?? 0,
				durationMs,
			};
		} finally {
			this.activeQuery = null;
		}
	}

	async cancel(): Promise<void> {
		if (this.activeQuery) {
			this.activeQuery.cancel();
			this.activeQuery = null;
		}
	}

	async loadSchema(): Promise<SchemaData> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;

		const schemas = await this.getSchemas();
		const schemaNames = schemas.map((s) => s.name);

		const tables: SchemaData["tables"] = {};
		for (const schema of schemas) {
			tables[schema.name] = await this.getTables(schema.name);
		}

		const [allColumns, allIndexes, allForeignKeys, allReferencingForeignKeys] = await Promise.all([
			// All columns across all schemas
			conn.unsafe(
				`SELECT
					c.table_schema,
					c.table_name,
					c.column_name,
					c.data_type,
					c.udt_name,
					c.is_nullable,
					c.column_default,
					c.character_maximum_length,
					CASE
						WHEN pk.column_name IS NOT NULL THEN true
						ELSE false
					END AS is_primary_key
				FROM information_schema.columns c
				LEFT JOIN (
					SELECT kcu.table_schema, kcu.table_name, kcu.column_name
					FROM information_schema.table_constraints tc
					JOIN information_schema.key_column_usage kcu
						ON tc.constraint_name = kcu.constraint_name
						AND tc.table_schema = kcu.table_schema
					WHERE tc.constraint_type = 'PRIMARY KEY'
						AND tc.table_schema = ANY($1)
				) pk ON pk.table_schema = c.table_schema
					AND pk.table_name = c.table_name
					AND pk.column_name = c.column_name
				WHERE c.table_schema = ANY($1)
				ORDER BY c.table_schema, c.table_name, c.ordinal_position`,
				[schemaNames],
			),
			// All indexes across all schemas
			conn.unsafe(
				`SELECT
					n.nspname AS table_schema,
					t.relname AS table_name,
					i.relname AS index_name,
					ix.indisunique AS is_unique,
					ix.indisprimary AS is_primary,
					array_agg(a.attname ORDER BY k.n) AS columns
				FROM pg_catalog.pg_index ix
				JOIN pg_catalog.pg_class t ON t.oid = ix.indrelid
				JOIN pg_catalog.pg_class i ON i.oid = ix.indexrelid
				JOIN pg_catalog.pg_namespace n ON n.oid = t.relnamespace
				CROSS JOIN LATERAL unnest(ix.indkey) WITH ORDINALITY AS k(attnum, n)
				JOIN pg_catalog.pg_attribute a
					ON a.attrelid = t.oid AND a.attnum = k.attnum
				WHERE n.nspname = ANY($1)
				GROUP BY n.nspname, t.relname, i.relname, ix.indisunique, ix.indisprimary
				ORDER BY n.nspname, t.relname, i.relname`,
				[schemaNames],
			),
			// All foreign keys across all schemas
			conn.unsafe(
				`SELECT
					nsp_src.nspname AS table_schema,
					cl_src.relname AS table_name,
					con.conname AS constraint_name,
					array_agg(att_src.attname ORDER BY u.pos) AS columns,
					nsp_ref.nspname AS referenced_schema,
					cl_ref.relname AS referenced_table,
					array_agg(att_ref.attname ORDER BY u.pos) AS referenced_columns,
					CASE con.confupdtype
						WHEN 'a' THEN 'NO ACTION'
						WHEN 'r' THEN 'RESTRICT'
						WHEN 'c' THEN 'CASCADE'
						WHEN 'n' THEN 'SET NULL'
						WHEN 'd' THEN 'SET DEFAULT'
					END AS on_update,
					CASE con.confdeltype
						WHEN 'a' THEN 'NO ACTION'
						WHEN 'r' THEN 'RESTRICT'
						WHEN 'c' THEN 'CASCADE'
						WHEN 'n' THEN 'SET NULL'
						WHEN 'd' THEN 'SET DEFAULT'
					END AS on_delete
				FROM pg_catalog.pg_constraint con
				JOIN pg_catalog.pg_class cl_src ON cl_src.oid = con.conrelid
				JOIN pg_catalog.pg_namespace nsp_src ON nsp_src.oid = cl_src.relnamespace
				JOIN pg_catalog.pg_class cl_ref ON cl_ref.oid = con.confrelid
				JOIN pg_catalog.pg_namespace nsp_ref ON nsp_ref.oid = cl_ref.relnamespace
				CROSS JOIN LATERAL unnest(con.conkey, con.confkey) WITH ORDINALITY AS u(src_attnum, ref_attnum, pos)
				JOIN pg_catalog.pg_attribute att_src
					ON att_src.attrelid = con.conrelid AND att_src.attnum = u.src_attnum
				JOIN pg_catalog.pg_attribute att_ref
					ON att_ref.attrelid = con.confrelid AND att_ref.attnum = u.ref_attnum
				WHERE con.contype = 'f'
					AND nsp_src.nspname = ANY($1)
				GROUP BY nsp_src.nspname, cl_src.relname, con.conname,
					nsp_ref.nspname, cl_ref.relname, con.confupdtype, con.confdeltype
				ORDER BY nsp_src.nspname, cl_src.relname, con.conname`,
				[schemaNames],
			),
			// All referencing foreign keys across all schemas
			conn.unsafe(
				`SELECT
					nsp_ref.nspname AS referenced_schema,
					cl_ref.relname AS referenced_table,
					con.conname AS constraint_name,
					nsp_src.nspname AS referencing_schema,
					cl_src.relname AS referencing_table,
					array_agg(att_src.attname ORDER BY u.pos) AS referencing_columns,
					array_agg(att_ref.attname ORDER BY u.pos) AS referenced_columns
				FROM pg_catalog.pg_constraint con
				JOIN pg_catalog.pg_class cl_src ON cl_src.oid = con.conrelid
				JOIN pg_catalog.pg_namespace nsp_src ON nsp_src.oid = cl_src.relnamespace
				JOIN pg_catalog.pg_class cl_ref ON cl_ref.oid = con.confrelid
				JOIN pg_catalog.pg_namespace nsp_ref ON nsp_ref.oid = cl_ref.relnamespace
				CROSS JOIN LATERAL unnest(con.conkey, con.confkey) WITH ORDINALITY AS u(src_attnum, ref_attnum, pos)
				JOIN pg_catalog.pg_attribute att_src
					ON att_src.attrelid = con.conrelid AND att_src.attnum = u.src_attnum
				JOIN pg_catalog.pg_attribute att_ref
					ON att_ref.attrelid = con.confrelid AND att_ref.attnum = u.ref_attnum
				WHERE con.contype = 'f'
					AND nsp_ref.nspname = ANY($1)
				GROUP BY nsp_ref.nspname, cl_ref.relname, con.conname,
					nsp_src.nspname, cl_src.relname
				ORDER BY nsp_ref.nspname, cl_ref.relname, con.conname`,
				[schemaNames],
			),
		]);

		// Group columns by schema.table
		const columns: SchemaData["columns"] = {};
		for (const row of allColumns as any[]) {
			const key = `${row.table_schema}.${row.table_name}`;
			if (!columns[key]) columns[key] = [];
			columns[key].push({
				name: row.column_name,
				dataType: this.normalizeDataType(row.data_type, row.udt_name),
				nullable: row.is_nullable === "YES",
				defaultValue: row.column_default,
				isPrimaryKey: row.is_primary_key,
				isAutoIncrement:
					row.is_primary_key &&
					typeof row.column_default === "string" &&
					row.column_default.startsWith("nextval("),
				maxLength: row.character_maximum_length ?? undefined,
			});
		}

		// Group indexes by schema.table
		const indexes: SchemaData["indexes"] = {};
		for (const row of allIndexes as any[]) {
			const key = `${row.table_schema}.${row.table_name}`;
			if (!indexes[key]) indexes[key] = [];
			indexes[key].push({
				name: row.index_name,
				columns: typeof row.columns === "string"
					? row.columns.replace(/^\{|\}$/g, "").split(",")
					: row.columns,
				isUnique: row.is_unique,
				isPrimary: row.is_primary,
			});
		}

		// Group foreign keys by schema.table
		const foreignKeys: SchemaData["foreignKeys"] = {};
		for (const row of allForeignKeys as any[]) {
			const key = `${row.table_schema}.${row.table_name}`;
			if (!foreignKeys[key]) foreignKeys[key] = [];
			foreignKeys[key].push({
				name: row.constraint_name,
				columns: typeof row.columns === "string"
					? row.columns.replace(/^\{|\}$/g, "").split(",")
					: row.columns,
				referencedSchema: row.referenced_schema,
				referencedTable: row.referenced_table,
				referencedColumns: typeof row.referenced_columns === "string"
					? row.referenced_columns.replace(/^\{|\}$/g, "").split(",")
					: row.referenced_columns,
				onUpdate: row.on_update,
				onDelete: row.on_delete,
			});
		}

		// Group referencing foreign keys by schema.table (the referenced table)
		const referencingForeignKeys: SchemaData["referencingForeignKeys"] = {};
		for (const row of allReferencingForeignKeys as any[]) {
			const key = `${row.referenced_schema}.${row.referenced_table}`;
			if (!referencingForeignKeys[key]) referencingForeignKeys[key] = [];
			referencingForeignKeys[key].push({
				constraintName: row.constraint_name,
				referencingSchema: row.referencing_schema,
				referencingTable: row.referencing_table,
				referencingColumns: typeof row.referencing_columns === "string"
					? row.referencing_columns.replace(/^\{|\}$/g, "").split(",")
					: row.referencing_columns,
				referencedColumns: typeof row.referenced_columns === "string"
					? row.referenced_columns.replace(/^\{|\}$/g, "").split(",")
					: row.referenced_columns,
			});
		}

		// Ensure every table has entries (even if empty)
		for (const schema of schemas) {
			for (const table of tables[schema.name]) {
				const key = `${schema.name}.${table.name}`;
				if (!columns[key]) columns[key] = [];
				if (!indexes[key]) indexes[key] = [];
				if (!foreignKeys[key]) foreignKeys[key] = [];
				if (!referencingForeignKeys[key]) referencingForeignKeys[key] = [];
			}
		}

		return { schemas, tables, columns, indexes, foreignKeys, referencingForeignKeys };
	}

	async getSchemas(): Promise<SchemaInfo[]> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const rows = await conn.unsafe(
			`SELECT schema_name AS name
			FROM information_schema.schemata
			WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
			ORDER BY schema_name`,
		);
		return [...rows] as SchemaInfo[];
	}

	async getTables(schema: string): Promise<TableInfo[]> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const rows = await conn.unsafe(
			`SELECT table_name AS name, table_type
			FROM information_schema.tables
			WHERE table_schema = $1
			ORDER BY table_name`,
			[schema],
		);
		return [...rows].map((row: any) => ({
			schema,
			name: row.name,
			type: row.table_type === "VIEW" ? "view" : "table",
		}));
	}

	async getColumns(schema: string, table: string): Promise<ColumnInfo[]> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const rows = await conn.unsafe(
			`SELECT
				c.column_name,
				c.data_type,
				c.udt_name,
				c.is_nullable,
				c.column_default,
				c.character_maximum_length,
				CASE
					WHEN pk.column_name IS NOT NULL THEN true
					ELSE false
				END AS is_primary_key
			FROM information_schema.columns c
			LEFT JOIN (
				SELECT kcu.column_name
				FROM information_schema.table_constraints tc
				JOIN information_schema.key_column_usage kcu
					ON tc.constraint_name = kcu.constraint_name
					AND tc.table_schema = kcu.table_schema
				WHERE tc.constraint_type = 'PRIMARY KEY'
					AND tc.table_schema = $1
					AND tc.table_name = $2
			) pk ON pk.column_name = c.column_name
			WHERE c.table_schema = $1 AND c.table_name = $2
			ORDER BY c.ordinal_position`,
			[schema, table],
		);

		return [...rows].map((row: any) => ({
			name: row.column_name,
			dataType: this.normalizeDataType(row.data_type, row.udt_name),
			nullable: row.is_nullable === "YES",
			defaultValue: row.column_default,
			isPrimaryKey: row.is_primary_key,
			isAutoIncrement:
				row.is_primary_key &&
				typeof row.column_default === "string" &&
				row.column_default.startsWith("nextval("),
			maxLength: row.character_maximum_length ?? undefined,
		}));
	}

	async getIndexes(schema: string, table: string): Promise<IndexInfo[]> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const rows = await conn.unsafe(
			`SELECT
				i.relname AS index_name,
				ix.indisunique AS is_unique,
				ix.indisprimary AS is_primary,
				array_agg(a.attname ORDER BY k.n) AS columns
			FROM pg_catalog.pg_index ix
			JOIN pg_catalog.pg_class t ON t.oid = ix.indrelid
			JOIN pg_catalog.pg_class i ON i.oid = ix.indexrelid
			JOIN pg_catalog.pg_namespace n ON n.oid = t.relnamespace
			CROSS JOIN LATERAL unnest(ix.indkey) WITH ORDINALITY AS k(attnum, n)
			JOIN pg_catalog.pg_attribute a
				ON a.attrelid = t.oid AND a.attnum = k.attnum
			WHERE n.nspname = $1 AND t.relname = $2
			GROUP BY i.relname, ix.indisunique, ix.indisprimary
			ORDER BY i.relname`,
			[schema, table],
		);

		return [...rows].map((row: any) => ({
			name: row.index_name,
			columns: typeof row.columns === "string"
				? row.columns.replace(/^\{|\}$/g, "").split(",")
				: row.columns,
			isUnique: row.is_unique,
			isPrimary: row.is_primary,
		}));
	}

	async getForeignKeys(
		schema: string,
		table: string,
	): Promise<ForeignKeyInfo[]> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const rows = await conn.unsafe(
			`SELECT
				con.conname AS constraint_name,
				array_agg(att_src.attname ORDER BY u.pos) AS columns,
				nsp_ref.nspname AS referenced_schema,
				cl_ref.relname AS referenced_table,
				array_agg(att_ref.attname ORDER BY u.pos) AS referenced_columns,
				CASE con.confupdtype
					WHEN 'a' THEN 'NO ACTION'
					WHEN 'r' THEN 'RESTRICT'
					WHEN 'c' THEN 'CASCADE'
					WHEN 'n' THEN 'SET NULL'
					WHEN 'd' THEN 'SET DEFAULT'
				END AS on_update,
				CASE con.confdeltype
					WHEN 'a' THEN 'NO ACTION'
					WHEN 'r' THEN 'RESTRICT'
					WHEN 'c' THEN 'CASCADE'
					WHEN 'n' THEN 'SET NULL'
					WHEN 'd' THEN 'SET DEFAULT'
				END AS on_delete
			FROM pg_catalog.pg_constraint con
			JOIN pg_catalog.pg_class cl_src ON cl_src.oid = con.conrelid
			JOIN pg_catalog.pg_namespace nsp_src ON nsp_src.oid = cl_src.relnamespace
			JOIN pg_catalog.pg_class cl_ref ON cl_ref.oid = con.confrelid
			JOIN pg_catalog.pg_namespace nsp_ref ON nsp_ref.oid = cl_ref.relnamespace
			CROSS JOIN LATERAL unnest(con.conkey, con.confkey) WITH ORDINALITY AS u(src_attnum, ref_attnum, pos)
			JOIN pg_catalog.pg_attribute att_src
				ON att_src.attrelid = con.conrelid AND att_src.attnum = u.src_attnum
			JOIN pg_catalog.pg_attribute att_ref
				ON att_ref.attrelid = con.confrelid AND att_ref.attnum = u.ref_attnum
			WHERE con.contype = 'f'
				AND nsp_src.nspname = $1
				AND cl_src.relname = $2
			GROUP BY con.conname, nsp_ref.nspname, cl_ref.relname, con.confupdtype, con.confdeltype
			ORDER BY con.conname`,
			[schema, table],
		);

		return [...rows].map((row: any) => ({
			name: row.constraint_name,
			columns: typeof row.columns === "string"
				? row.columns.replace(/^\{|\}$/g, "").split(",")
				: row.columns,
			referencedSchema: row.referenced_schema,
			referencedTable: row.referenced_table,
			referencedColumns: typeof row.referenced_columns === "string"
				? row.referenced_columns.replace(/^\{|\}$/g, "").split(",")
				: row.referenced_columns,
			onUpdate: row.on_update,
			onDelete: row.on_delete,
		}));
	}

	async getReferencingForeignKeys(
		schema: string,
		table: string,
	): Promise<ReferencingForeignKeyInfo[]> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const rows = await conn.unsafe(
			`SELECT
				con.conname AS constraint_name,
				nsp_src.nspname AS referencing_schema,
				cl_src.relname AS referencing_table,
				array_agg(att_src.attname ORDER BY u.pos) AS referencing_columns,
				array_agg(att_ref.attname ORDER BY u.pos) AS referenced_columns
			FROM pg_catalog.pg_constraint con
			JOIN pg_catalog.pg_class cl_src ON cl_src.oid = con.conrelid
			JOIN pg_catalog.pg_namespace nsp_src ON nsp_src.oid = cl_src.relnamespace
			JOIN pg_catalog.pg_class cl_ref ON cl_ref.oid = con.confrelid
			JOIN pg_catalog.pg_namespace nsp_ref ON nsp_ref.oid = cl_ref.relnamespace
			CROSS JOIN LATERAL unnest(con.conkey, con.confkey) WITH ORDINALITY AS u(src_attnum, ref_attnum, pos)
			JOIN pg_catalog.pg_attribute att_src
				ON att_src.attrelid = con.conrelid AND att_src.attnum = u.src_attnum
			JOIN pg_catalog.pg_attribute att_ref
				ON att_ref.attrelid = con.confrelid AND att_ref.attnum = u.ref_attnum
			WHERE con.contype = 'f'
				AND nsp_ref.nspname = $1
				AND cl_ref.relname = $2
			GROUP BY con.conname, nsp_src.nspname, cl_src.relname
			ORDER BY nsp_src.nspname, cl_src.relname, con.conname`,
			[schema, table],
		);

		return [...rows].map((row: any) => ({
			constraintName: row.constraint_name,
			referencingSchema: row.referencing_schema,
			referencingTable: row.referencing_table,
			referencingColumns: typeof row.referencing_columns === "string"
				? row.referencing_columns.replace(/^\{|\}$/g, "").split(",")
				: row.referencing_columns,
			referencedColumns: typeof row.referenced_columns === "string"
				? row.referenced_columns.replace(/^\{|\}$/g, "").split(",")
				: row.referenced_columns,
		}));
	}

	async getPrimaryKey(schema: string, table: string): Promise<string[]> {
		this.ensureConnected();
		const conn = this.reservedConn ?? this.db!;
		const rows = await conn.unsafe(
			`SELECT kcu.column_name
			FROM information_schema.table_constraints tc
			JOIN information_schema.key_column_usage kcu
				ON tc.constraint_name = kcu.constraint_name
				AND tc.table_schema = kcu.table_schema
			WHERE tc.constraint_type = 'PRIMARY KEY'
				AND tc.table_schema = $1
				AND tc.table_name = $2
			ORDER BY kcu.ordinal_position`,
			[schema, table],
		);
		return [...rows].map((row: any) => row.column_name);
	}

	async beginTransaction(): Promise<void> {
		this.ensureConnected();
		const conn = await this.db!.reserve();
		try {
			await conn.unsafe("BEGIN");
		} catch (err) {
			conn.release();
			throw err;
		}
		this.reservedConn = conn;
		this.txActive = true;
	}

	async commit(): Promise<void> {
		this.ensureConnected();
		if (!this.reservedConn) {
			throw new Error("No active transaction");
		}
		await this.reservedConn.unsafe("COMMIT");
		this.reservedConn.release();
		this.reservedConn = null;
		this.txActive = false;
	}

	async rollback(): Promise<void> {
		this.ensureConnected();
		if (!this.reservedConn) {
			throw new Error("No active transaction");
		}
		await this.reservedConn.unsafe("ROLLBACK");
		this.reservedConn.release();
		this.reservedConn = null;
		this.txActive = false;
	}

	inTransaction(): boolean {
		return this.txActive;
	}

	getDriverType(): "postgresql" {
		return "postgresql";
	}

	quoteIdentifier(name: string): string {
		return `"${name.replace(/"/g, '""')}"`;
	}

	qualifyTable(schema: string, table: string): string {
		return `${this.quoteIdentifier(schema)}.${this.quoteIdentifier(table)}`;
	}

	emptyInsertSql(qualifiedTable: string): string {
		return `INSERT INTO ${qualifiedTable} DEFAULT VALUES`;
	}

	private ensureConnected(): void {
		if (!this.db || !this.connected) {
			throw new Error("Not connected. Call connect() first.");
		}
	}

	private normalizeDataType(dataType: string, udtName: string): string {
		// Map information_schema data_type to more useful display names
		switch (dataType) {
			case "ARRAY":
				// udtName starts with _ for array types, e.g. _int4 → int4[]
				return udtName.startsWith("_")
					? `${udtName.slice(1)}[]`
					: `${udtName}[]`;
			case "USER-DEFINED":
				return udtName; // e.g. "jsonb", "hstore"
			default:
				return dataType;
		}
	}
}
