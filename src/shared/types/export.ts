// Export types

export type ExportFormat = "csv" | "json" | "sql";

export interface ExportOptions {
	connectionId: string;
	schema: string;
	table: string;
	format: ExportFormat;
	/** Include column headers (for CSV) */
	includeHeaders?: boolean;
	/** Target file path (from save dialog) */
	filePath: string;
	/** Limit rows to export (undefined = all) */
	limit?: number;
}

export interface ExportPreviewRequest {
	connectionId: string;
	schema: string;
	table: string;
	format: ExportFormat;
	limit: number;
}

export interface ExportResult {
	rowCount: number;
	filePath: string;
	sizeBytes: number;
}
