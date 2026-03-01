import type { DatabaseDriver } from "../bun/db/driver";
import type { ConnectionConfig } from "../shared/types/connection";
import type { QueryResult, QueryResultColumn } from "../shared/types/query";
import type {
	SchemaInfo,
	TableInfo,
	ColumnInfo,
	IndexInfo,
	ForeignKeyInfo,
	ReferencingForeignKeyInfo,
} from "../shared/types/database";

/**
 * DatabaseDriver implementation backed by @sqlite.org/sqlite-wasm OO1 API.
 * Runs entirely in the browser — no server needed.
 */
export class WasmSqliteDriver implements DatabaseDriver {
	private connected = false;
	private txActive = false;

	constructor(private db: any) {
		this.connected = true;
	}

	async connect(_config: ConnectionConfig): Promise<void> {
		// DB is already loaded via the constructor
		this.connected = true;
	}

	async disconnect(): Promise<void> {
		this.connected = false;
		this.txActive = false;
	}

	isConnected(): boolean {
		return this.connected;
	}

	async execute(sql: string, params?: unknown[]): Promise<QueryResult> {
		this.ensureConnected();
		const start = performance.now();

		try {
			const resultRows: Record<string, unknown>[] = [];
			this.db.exec({
				sql,
				bind: params && params.length > 0 ? params : undefined,
				rowMode: "object",
				resultRows,
			});
			const durationMs = Math.round(performance.now() - start);

			const columns: QueryResultColumn[] =
				resultRows.length > 0
					? Object.keys(resultRows[0]).map((name) => ({ name, dataType: "unknown" }))
					: [];

			return {
				columns,
				rows: resultRows,
				rowCount: resultRows.length,
				affectedRows: this.db.changes(),
				durationMs,
			};
		} catch (err) {
			const durationMs = Math.round(performance.now() - start);
			// Re-throw with duration info available to caller
			const error = err instanceof Error ? err : new Error(String(err));
			(error as any).durationMs = durationMs;
			throw error;
		}
	}

	async cancel(): Promise<void> {
		// WASM SQLite operations are synchronous; cancellation not supported
	}

	async getSchemas(): Promise<SchemaInfo[]> {
		return [{ name: "main" }];
	}

	async getTables(schema: string): Promise<TableInfo[]> {
		this.ensureConnected();
		const rows: any[] = [];
		this.db.exec({
			sql: "SELECT name, type FROM sqlite_master WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%' ORDER BY name",
			rowMode: "object",
			resultRows: rows,
		});
		return rows.map((row: any) => ({
			schema,
			name: row.name,
			type: row.type as "table" | "view",
		}));
	}

	async getColumns(_schema: string, table: string): Promise<ColumnInfo[]> {
		this.ensureConnected();
		const rows: any[] = [];
		this.db.exec({
			sql: `PRAGMA table_info(${this.quoteIdentifier(table)})`,
			rowMode: "object",
			resultRows: rows,
		});

		const pkCount = rows.filter((r) => r.pk > 0).length;

		return rows.map((row) => ({
			name: row.name,
			dataType: row.type || "BLOB",
			nullable: row.notnull === 0 && row.pk === 0,
			defaultValue: row.dflt_value,
			isPrimaryKey: row.pk > 0,
			isAutoIncrement:
				row.pk > 0 &&
				pkCount === 1 &&
				row.type?.toUpperCase() === "INTEGER",
		}));
	}

	async getIndexes(_schema: string, table: string): Promise<IndexInfo[]> {
		this.ensureConnected();
		const indexList: any[] = [];
		this.db.exec({
			sql: `PRAGMA index_list(${this.quoteIdentifier(table)})`,
			rowMode: "object",
			resultRows: indexList,
		});

		const indexes: IndexInfo[] = [];
		for (const idx of indexList) {
			const indexInfo: any[] = [];
			this.db.exec({
				sql: `PRAGMA index_info(${this.quoteIdentifier(idx.name)})`,
				rowMode: "object",
				resultRows: indexInfo,
			});
			indexes.push({
				name: idx.name,
				columns: indexInfo.map((col) => col.name),
				isUnique: idx.unique === 1,
				isPrimary: idx.origin === "pk",
			});
		}
		return indexes;
	}

	async getForeignKeys(
		_schema: string,
		table: string,
	): Promise<ForeignKeyInfo[]> {
		this.ensureConnected();
		const rows: any[] = [];
		this.db.exec({
			sql: `PRAGMA foreign_key_list(${this.quoteIdentifier(table)})`,
			rowMode: "object",
			resultRows: rows,
		});

		const fkMap = new Map<number, ForeignKeyInfo>();
		for (const row of rows) {
			const existing = fkMap.get(row.id);
			if (existing) {
				existing.columns.push(row.from);
				existing.referencedColumns.push(row.to);
			} else {
				fkMap.set(row.id, {
					name: `fk_${table}_${row.id}`,
					columns: [row.from],
					referencedSchema: "main",
					referencedTable: row.table,
					referencedColumns: [row.to],
					onUpdate: row.on_update,
					onDelete: row.on_delete,
				});
			}
		}
		return Array.from(fkMap.values());
	}

	async getReferencingForeignKeys(
		_schema: string,
		table: string,
	): Promise<ReferencingForeignKeyInfo[]> {
		this.ensureConnected();

		const tables: any[] = [];
		this.db.exec({
			sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
			rowMode: "object",
			resultRows: tables,
		});

		const result: ReferencingForeignKeyInfo[] = [];

		for (const t of tables) {
			const fks: any[] = [];
			this.db.exec({
				sql: `PRAGMA foreign_key_list(${this.quoteIdentifier(t.name)})`,
				rowMode: "object",
				resultRows: fks,
			});

			const fkMap = new Map<number, { from: string[]; to: string[] }>();
			for (const row of fks) {
				if (row.table !== table) continue;
				const existing = fkMap.get(row.id);
				if (existing) {
					existing.from.push(row.from);
					existing.to.push(row.to);
				} else {
					fkMap.set(row.id, {
						from: [row.from],
						to: [row.to],
					});
				}
			}

			for (const [id, fk] of fkMap) {
				result.push({
					constraintName: `fk_${t.name}_${id}`,
					referencingSchema: "main",
					referencingTable: t.name,
					referencingColumns: fk.from,
					referencedColumns: fk.to,
				});
			}
		}

		return result;
	}

	async getPrimaryKey(_schema: string, table: string): Promise<string[]> {
		this.ensureConnected();
		const rows: any[] = [];
		this.db.exec({
			sql: `PRAGMA table_info(${this.quoteIdentifier(table)})`,
			rowMode: "object",
			resultRows: rows,
		});
		return rows
			.filter((row) => row.pk > 0)
			.sort((a, b) => a.pk - b.pk)
			.map((row) => row.name);
	}

	async beginTransaction(): Promise<void> {
		this.ensureConnected();
		this.db.exec("BEGIN");
		this.txActive = true;
	}

	async commit(): Promise<void> {
		this.ensureConnected();
		this.db.exec("COMMIT");
		this.txActive = false;
	}

	async rollback(): Promise<void> {
		this.ensureConnected();
		this.db.exec("ROLLBACK");
		this.txActive = false;
	}

	inTransaction(): boolean {
		return this.txActive;
	}

	getDriverType(): "postgresql" | "sqlite" {
		return "sqlite";
	}

	quoteIdentifier(name: string): string {
		return `"${name.replace(/"/g, '""')}"`;
	}

	qualifyTable(schema: string, table: string): string {
		if (schema === "main") return this.quoteIdentifier(table);
		return `${this.quoteIdentifier(schema)}.${this.quoteIdentifier(table)}`;
	}

	emptyInsertSql(qualifiedTable: string): string {
		return `INSERT INTO ${qualifiedTable} DEFAULT VALUES`;
	}

	private ensureConnected(): void {
		if (!this.connected) {
			throw new Error("Not connected. Call connect() first.");
		}
	}
}
