import type { WasmSqliteDriver } from "./wasm-sqlite-driver";
import type { DemoAppState } from "./demo-state";
import type { GridDataRequest } from "../shared/types/grid";
import type { ExportOptions, ExportPreviewRequest } from "../shared/types/export";
import type { ApplyChangesParams, GenerateSqlParams, ExecuteQueryParams, HistoryListParams, ViewListParams, SaveViewParams, UpdateViewParams } from "../shared/types/rpc";
import type { QueryResult } from "../shared/types/query";
import {
	buildSelectQuery,
	buildCountQuery,
	generateChangeSql,
	generateChangesPreview,
	splitStatements,
} from "../bun/services/query-executor";
import { formatSql } from "../bun/services/sql-formatter";
import { exportPreview } from "../bun/services/export-service";

const DEFAULT_SETTINGS: Record<string, string> = {
	defaultPageSize: "100",
	defaultTxMode: "auto-commit",
	theme: "dark",
	queryTimeout: "30000",
	maxHistoryEntries: "1000",
	clipboardIncludeHeaders: "true",
	exportDefaultFormat: "csv",
};

type EmitMessage = (channel: string, payload: any) => void;

export function createDemoHandlers(
	driver: WasmSqliteDriver,
	state: DemoAppState,
	emitMessage: EmitMessage,
) {
	// Track which connections are "connected"
	const connectedSet = new Set<string>();

	function getDriver(connectionId: string): WasmSqliteDriver {
		if (!connectedSet.has(connectionId)) {
			throw new Error(`Connection ${connectionId} is not connected`);
		}
		return driver;
	}

	function logHistory(connectionId: string, sql: string, results: QueryResult[]): void {
		const hasError = results.some((r) => r.error);
		const totalDuration = results.reduce((sum, r) => sum + (r.durationMs ?? 0), 0);
		const totalRows = results.reduce((sum, r) => sum + (r.affectedRows ?? r.rowCount), 0);
		const errorMessage = results.find((r) => r.error)?.error;

		try {
			state.addHistory({
				connectionId,
				sql,
				status: hasError ? "error" : "success",
				durationMs: Math.round(totalDuration),
				rowCount: totalRows,
				errorMessage,
			});
		} catch {
			// Don't let history logging break query execution
		}
	}

	return {
		// ── Connection Management ─────────────────────────
		"connections.list": () => {
			return state.listConnections();
		},
		"connections.create": ({ name, config }: { name: string; config: any }) => {
			return state.createConnection({ name, config });
		},
		"connections.update": ({ id, name, config }: { id: string; name: string; config: any }) => {
			return state.updateConnection({ id, name, config });
		},
		"connections.delete": ({ id }: { id: string }) => {
			state.deleteConnection(id);
			connectedSet.delete(id);
		},
		"connections.test": async ({ config }: { config: any }) => {
			if (config.type === "sqlite") {
				return { success: true };
			}
			return { success: false, error: "Only SQLite connections are supported in demo mode" };
		},
		"connections.connect": async ({ connectionId }: { connectionId: string }) => {
			const conn = state.getConnectionById(connectionId);
			if (!conn) throw new Error(`Connection not found: ${connectionId}`);

			emitMessage("connections.statusChanged", {
				connectionId,
				state: "connecting",
			});

			connectedSet.add(connectionId);

			emitMessage("connections.statusChanged", {
				connectionId,
				state: "connected",
			});
		},
		"connections.disconnect": async ({ connectionId }: { connectionId: string }) => {
			connectedSet.delete(connectionId);
			emitMessage("connections.statusChanged", {
				connectionId,
				state: "disconnected",
			});
		},

		// ── Databases (not available in demo) ────────────
		"databases.list": async () => {
			return [];
		},
		"databases.activate": async () => {
			throw new Error("Multi-database is not available in demo mode");
		},
		"databases.deactivate": async () => {
			throw new Error("Multi-database is not available in demo mode");
		},

		// ── Schema ───────────────────────────────────────
		"schema.getSchemas": async ({ connectionId }: { connectionId: string }) => {
			getDriver(connectionId);
			return driver.getSchemas();
		},
		"schema.getTables": async ({ connectionId, schema }: { connectionId: string; schema: string }) => {
			getDriver(connectionId);
			return driver.getTables(schema);
		},
		"schema.getColumns": async ({ connectionId, schema, table }: { connectionId: string; schema: string; table: string }) => {
			getDriver(connectionId);
			return driver.getColumns(schema, table);
		},
		"schema.getIndexes": async ({ connectionId, schema, table }: { connectionId: string; schema: string; table: string }) => {
			getDriver(connectionId);
			return driver.getIndexes(schema, table);
		},
		"schema.getForeignKeys": async ({ connectionId, schema, table }: { connectionId: string; schema: string; table: string }) => {
			getDriver(connectionId);
			return driver.getForeignKeys(schema, table);
		},

		// ── Data Grid ────────────────────────────────────
		"data.getTableData": async (req: GridDataRequest) => {
			const d = getDriver(req.connectionId);
			const { sql, params } = buildSelectQuery(
				req.schema, req.table, req.page, req.pageSize,
				req.sort, req.filters, d,
			);
			const result = await d.execute(sql, params);

			const columns = await d.getColumns(req.schema, req.table);
			const gridColumns = columns.map((c) => ({
				name: c.name,
				dataType: c.dataType,
				nullable: c.nullable,
				isPrimaryKey: c.isPrimaryKey,
			}));

			const countQuery = buildCountQuery(req.schema, req.table, req.filters, d);
			const countResult = await d.execute(countQuery.sql, countQuery.params);
			const totalRows = Number(countResult.rows[0]?.count ?? 0);

			return {
				columns: gridColumns,
				rows: result.rows,
				totalRows,
				page: req.page,
				pageSize: req.pageSize,
			};
		},
		"data.getRowCount": async ({ connectionId, schema, table, filters }: { connectionId: string; schema: string; table: string; filters?: any[] }) => {
			const d = getDriver(connectionId);
			const { sql, params } = buildCountQuery(schema, table, filters, d);
			const result = await d.execute(sql, params);
			return { count: Number(result.rows[0]?.count ?? 0) };
		},
		"data.getColumnStats": () => {
			throw new Error("Not implemented in demo mode");
		},

		// ── Data Editing ─────────────────────────────────
		"data.applyChanges": async ({ connectionId, changes }: ApplyChangesParams) => {
			const d = getDriver(connectionId);
			const inExistingTx = d.inTransaction();

			if (!inExistingTx) {
				await d.beginTransaction();
			}
			try {
				for (const change of changes) {
					const { sql, params } = generateChangeSql(change, d);
					await d.execute(sql, params);
				}
				if (!inExistingTx) {
					await d.commit();
				}
				return { appliedCount: changes.length };
			} catch (err) {
				if (!inExistingTx) {
					try {
						await d.rollback();
					} catch {
						// Don't mask the original error
					}
				}
				throw err;
			}
		},
		"data.generateSql": ({ connectionId, changes }: GenerateSqlParams) => {
			const d = getDriver(connectionId);
			const sql = generateChangesPreview(changes, d);
			return { sql };
		},

		// ── Query Execution ──────────────────────────────
		"query.execute": async ({ connectionId, sql, params }: ExecuteQueryParams) => {
			const d = getDriver(connectionId);
			const statements = splitStatements(sql);

			if (statements.length === 0) {
				return [];
			}

			const results: QueryResult[] = [];

			for (const stmt of statements) {
				const start = performance.now();
				try {
					const result = await d.execute(
						stmt,
						statements.length === 1 ? params : undefined,
					);
					results.push({
						...result,
						durationMs: Math.round(performance.now() - start),
					});
				} catch (err) {
					results.push({
						columns: [],
						rows: [],
						rowCount: 0,
						durationMs: Math.round(performance.now() - start),
						error: err instanceof Error ? err.message : String(err),
					});
					break;
				}
			}

			logHistory(connectionId, sql, results);
			return results;
		},
		"query.cancel": async () => {
			// WASM SQLite operations are synchronous; cancellation is a no-op
		},
		"query.format": ({ sql }: { sql: string }) => {
			return { sql: formatSql(sql) };
		},

		// ── Transactions ─────────────────────────────────
		"tx.begin": async ({ connectionId }: { connectionId: string }) => {
			const d = getDriver(connectionId);
			if (d.inTransaction()) {
				throw new Error("Transaction already active");
			}
			await d.beginTransaction();
		},
		"tx.commit": async ({ connectionId }: { connectionId: string }) => {
			const d = getDriver(connectionId);
			if (!d.inTransaction()) {
				throw new Error("No active transaction");
			}
			await d.commit();
		},
		"tx.rollback": async ({ connectionId }: { connectionId: string }) => {
			const d = getDriver(connectionId);
			if (!d.inTransaction()) {
				throw new Error("No active transaction");
			}
			await d.rollback();
		},
		"tx.status": ({ connectionId }: { connectionId: string }) => {
			const d = getDriver(connectionId);
			return { active: d.inTransaction() };
		},

		// ── Export ────────────────────────────────────────
		"export.exportData": async (opts: ExportOptions) => {
			// In browser demo, generate content in-memory and trigger download
			const d = getDriver(opts.connectionId);
			const content = await exportPreview(d, {
				schema: opts.schema,
				table: opts.table,
				format: opts.format,
				columns: opts.columns,
				delimiter: opts.delimiter,
				filters: opts.filters,
				sort: opts.sort,
				limit: opts.limit,
			});

			// Trigger browser download
			const mimeTypes: Record<string, string> = {
				csv: "text/csv",
				json: "application/json",
				sql: "text/sql",
			};
			const blob = new Blob([content], { type: mimeTypes[opts.format] ?? "text/plain" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = opts.filePath || `export.${opts.format}`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			const encoder = new TextEncoder();
			return {
				rowCount: content.split("\n").length,
				filePath: opts.filePath,
				sizeBytes: encoder.encode(content).length,
			};
		},
		"export.preview": async (req: ExportPreviewRequest) => {
			const d = getDriver(req.connectionId);
			const content = await exportPreview(d, {
				schema: req.schema,
				table: req.table,
				format: req.format,
				columns: req.columns,
				delimiter: req.delimiter,
				filters: req.filters,
				sort: req.sort,
				limit: req.limit,
			});
			return { content };
		},

		// ── History ───────────────────────────────────────
		"history.list": (params: HistoryListParams) => {
			return state.listHistory(params);
		},
		"history.clear": ({ connectionId }: { connectionId?: string }) => {
			state.clearHistory(connectionId);
		},

		// ── Saved Views ──────────────────────────────────
		"views.list": ({ connectionId, schemaName, tableName }: ViewListParams) => {
			return state.listSavedViews(connectionId, schemaName, tableName);
		},
		"views.save": ({ connectionId, schemaName, tableName, name, config }: SaveViewParams) => {
			if (!name || !name.trim()) {
				throw new Error("View name is required");
			}
			if (!connectionId) {
				throw new Error("connectionId is required");
			}
			if (!tableName) {
				throw new Error("tableName is required");
			}
			const existing = state.listSavedViews(connectionId, schemaName, tableName);
			if (existing.some((v) => v.name === name.trim())) {
				throw new Error(`A view named "${name.trim()}" already exists for this table`);
			}
			return state.createSavedView({
				connectionId,
				schemaName,
				tableName,
				name: name.trim(),
				config,
			});
		},
		"views.update": ({ id, name, config }: UpdateViewParams) => {
			if (!id) {
				throw new Error("View id is required");
			}
			if (!name || !name.trim()) {
				throw new Error("View name is required");
			}
			const current = state.getSavedViewById(id);
			if (!current) {
				throw new Error(`Saved view not found: ${id}`);
			}
			const existing = state.listSavedViews(current.connectionId, current.schemaName, current.tableName);
			if (existing.some((v) => v.id !== id && v.name === name.trim())) {
				throw new Error(`A view named "${name.trim()}" already exists for this table`);
			}
			return state.updateSavedView({ id, name: name.trim(), config });
		},
		"views.delete": ({ id }: { id: string }) => {
			state.deleteSavedView(id);
		},
		"views.listByConnection": ({ connectionId }: { connectionId: string }) => {
			return state.listSavedViewsByConnection(connectionId);
		},

		// ── Storage ──────────────────────────────────────
		"storage.getMode": () => {
			return { stateless: false };
		},
		"storage.restore": async () => {
			// No-op in demo mode
		},
		"storage.encrypt": async () => {
			throw new Error("Encryption not available in demo mode");
		},

		// ── System ────────────────────────────────────────
		"system.showOpenDialog": () => {
			return { paths: [], cancelled: true };
		},
		"system.showSaveDialog": () => {
			return { path: null, cancelled: true };
		},
		"settings.get": ({ key }: { key: string }) => {
			const stored = state.getSetting(key);
			const value = stored ?? DEFAULT_SETTINGS[key] ?? null;
			return { value };
		},
		"settings.set": ({ key, value }: { key: string; value: string }) => {
			state.setSetting(key, value);
		},
		"settings.getAll": () => {
			const stored = state.getAllSettings();
			return { ...DEFAULT_SETTINGS, ...stored };
		},
	} as const;
}
