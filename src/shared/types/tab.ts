// Tab types

export type TabType = "data-grid" | "sql-console" | "schema-viewer";

export interface TabInfo {
	id: string;
	type: TabType;
	title: string;
	connectionId: string;
	/** Schema and table for data-grid and schema-viewer tabs */
	schema?: string;
	table?: string;
	/** Whether the tab has unsaved changes */
	dirty?: boolean;
}
