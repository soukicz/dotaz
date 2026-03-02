import type { ConnectionConfig } from "../../shared/types/connection";
import type { SqlDialect } from "../../shared/sql/dialect";
import type { QueryResult } from "../../shared/types/query";
import type { SchemaData } from "../../shared/types/database";

export interface DatabaseDriver extends SqlDialect {
	// Lifecycle
	connect(config: ConnectionConfig): Promise<void>;
	disconnect(): Promise<void>;
	isConnected(): boolean;

	// Query execution
	execute(sql: string, params?: unknown[]): Promise<QueryResult>;
	cancel(): Promise<void>;

	// Streaming iteration — yields batches of rows from a query
	iterate(
		sql: string,
		params?: unknown[],
		batchSize?: number,
		signal?: AbortSignal,
	): AsyncIterable<Record<string, unknown>[]>;

	// Bulk insert — inserts rows using multi-row VALUES, returns affected count
	importBatch(
		qualifiedTable: string,
		columns: string[],
		rows: Record<string, unknown>[],
	): Promise<number>;

	// Schema introspection
	loadSchema(): Promise<SchemaData>;

	// Transactions
	beginTransaction(): Promise<void>;
	commit(): Promise<void>;
	rollback(): Promise<void>;
	inTransaction(): boolean;
}
