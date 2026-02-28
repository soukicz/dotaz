// Query execution and history types

export interface QueryRequest {
	connectionId: string;
	sql: string;
	params?: unknown[];
}

export interface QueryResultColumn {
	name: string;
	dataType: string;
}

export interface QueryResult {
	columns: QueryResultColumn[];
	rows: Record<string, unknown>[];
	rowCount: number;
	affectedRows?: number;
	durationMs: number;
	error?: string;
}

export type QueryHistoryStatus = "success" | "error";

export interface QueryHistoryEntry {
	id: number;
	connectionId: string;
	sql: string;
	status: QueryHistoryStatus;
	durationMs?: number;
	rowCount?: number;
	errorMessage?: string;
	executedAt: string;
}
