import type { BrowserWindow } from "electrobun/bun";
import type { DotazRPC } from "../shared/types/rpc";
import type { ConnectionManager } from "./services/connection-manager";

function notImplemented(method: string): never {
	throw new Error(`Not implemented yet: ${method}`);
}

export function createHandlers(cm: ConnectionManager) {
	return {
		// ── Connection Management ─────────────────────────
		"connections.list": () => {
			return cm.listConnections();
		},
		"connections.create": ({ name, config }: { name: string; config: any }) => {
			return cm.createConnection({ name, config });
		},
		"connections.update": ({ id, name, config }: { id: string; name: string; config: any }) => {
			return cm.updateConnection({ id, name, config });
		},
		"connections.delete": async ({ id }: { id: string }) => {
			await cm.deleteConnection(id);
		},
		"connections.test": async ({ config }: { config: any }) => {
			return cm.testConnection(config);
		},
		"connections.connect": async ({ connectionId }: { connectionId: string }) => {
			await cm.connect(connectionId);
		},
		"connections.disconnect": async ({ connectionId }: { connectionId: string }) => {
			await cm.disconnect(connectionId);
		},

		// ── Schema ───────────────────────────────────────
		"schema.getSchemas": async ({ connectionId }: { connectionId: string }) => {
			const driver = cm.getDriver(connectionId);
			return driver.getSchemas();
		},
		"schema.getTables": async ({ connectionId, schema }: { connectionId: string; schema: string }) => {
			const driver = cm.getDriver(connectionId);
			return driver.getTables(schema);
		},
		"schema.getColumns": async ({ connectionId, schema, table }: { connectionId: string; schema: string; table: string }) => {
			const driver = cm.getDriver(connectionId);
			return driver.getColumns(schema, table);
		},
		"schema.getIndexes": async ({ connectionId, schema, table }: { connectionId: string; schema: string; table: string }) => {
			const driver = cm.getDriver(connectionId);
			return driver.getIndexes(schema, table);
		},
		"schema.getForeignKeys": async ({ connectionId, schema, table }: { connectionId: string; schema: string; table: string }) => {
			const driver = cm.getDriver(connectionId);
			return driver.getForeignKeys(schema, table);
		},

		// ── Data Grid (stub) ─────────────────────────────
		"data.getTableData": () => {
			notImplemented("data.getTableData");
		},
		"data.getRowCount": () => {
			notImplemented("data.getRowCount");
		},
		"data.getColumnStats": () => {
			notImplemented("data.getColumnStats");
		},

		// ── Data Editing (stub) ──────────────────────────
		"data.applyChanges": () => {
			notImplemented("data.applyChanges");
		},
		"data.generateSql": () => {
			notImplemented("data.generateSql");
		},

		// ── Query Execution (stub) ────────────────────────
		"query.execute": () => {
			notImplemented("query.execute");
		},
		"query.cancel": () => {
			notImplemented("query.cancel");
		},
		"query.format": () => {
			notImplemented("query.format");
		},

		// ── Transactions (stub) ───────────────────────────
		"tx.begin": () => {
			notImplemented("tx.begin");
		},
		"tx.commit": () => {
			notImplemented("tx.commit");
		},
		"tx.rollback": () => {
			notImplemented("tx.rollback");
		},
		"tx.status": () => {
			notImplemented("tx.status");
		},

		// ── Export (stub) ─────────────────────────────────
		"export.exportData": () => {
			notImplemented("export.exportData");
		},
		"export.preview": () => {
			notImplemented("export.preview");
		},

		// ── History (stub) ────────────────────────────────
		"history.list": () => {
			notImplemented("history.list");
		},
		"history.clear": () => {
			notImplemented("history.clear");
		},

		// ── Saved Views (stub) ────────────────────────────
		"views.list": () => {
			notImplemented("views.list");
		},
		"views.save": () => {
			notImplemented("views.save");
		},
		"views.update": () => {
			notImplemented("views.update");
		},
		"views.delete": () => {
			notImplemented("views.delete");
		},

		// ── System (stub) ─────────────────────────────────
		"system.showOpenDialog": () => {
			notImplemented("system.showOpenDialog");
		},
		"system.showSaveDialog": () => {
			notImplemented("system.showSaveDialog");
		},
		"settings.get": () => {
			notImplemented("settings.get");
		},
		"settings.set": () => {
			notImplemented("settings.set");
		},
	} as const;
}

export function createRPC(cm: ConnectionManager) {
	// Lazy import to avoid Electrobun dependency in tests
	const { BrowserView } = require("electrobun/bun") as typeof import("electrobun/bun");
	return BrowserView.defineRPC<DotazRPC>({
		maxRequestTime: 30000,
		handlers: {
			requests: createHandlers(cm),
			messages: {},
		},
	});
}

export function setupStatusNotifications(
	window: BrowserWindow,
	cm: ConnectionManager,
): () => void {
	return cm.onStatusChanged((event) => {
		(window as any).webview.rpc.send["connections.statusChanged"]({
			connectionId: event.connectionId,
			state: event.state,
			error: event.error,
		});
	});
}
