import { createSignal, Show, Switch, Match, onMount, onCleanup } from "solid-js";
import Sidebar, { SidebarExpandButton } from "./Sidebar";
import Resizer from "./Resizer";
import TabBar from "./TabBar";
import StatusBar from "./StatusBar";
import ConnectionTree from "../connection/ConnectionTree";
import ConnectionDialog from "../connection/ConnectionDialog";
import QueryHistory from "../history/QueryHistory";
import CommandPalette from "../common/CommandPalette";
import DataGrid from "../grid/DataGrid";
import SqlEditor from "../editor/SqlEditor";
import QueryToolbar from "../editor/QueryToolbar";
import SqlResultPanel from "../editor/SqlResultPanel";
import SchemaViewer from "../schema/SchemaViewer";
import type { ConnectionInfo } from "../../../shared/types/connection";
import { tabsStore } from "../../stores/tabs";
import { connectionsStore } from "../../stores/connections";
import { editorStore } from "../../stores/editor";
import { gridStore } from "../../stores/grid";
import { commandRegistry } from "../../lib/commands";
import "./AppShell.css";

const MIN_WIDTH = 150;
const MAX_WIDTH = 500;
const DEFAULT_WIDTH = 250;

export default function AppShell() {
	const [sidebarWidth, setSidebarWidth] = createSignal(DEFAULT_WIDTH);
	const [sidebarCollapsed, setSidebarCollapsed] = createSignal(false);
	const [dialogOpen, setDialogOpen] = createSignal(false);
	const [connectionToEdit, setConnectionToEdit] = createSignal<ConnectionInfo | null>(null);
	const [historyOpen, setHistoryOpen] = createSignal(false);
	const [paletteOpen, setPaletteOpen] = createSignal(false);

	function handleResize(deltaX: number) {
		setSidebarWidth((w) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, w + deltaX)));
	}

	function toggleCollapse() {
		setSidebarCollapsed((c) => !c);
	}

	function openAddConnectionDialog() {
		setConnectionToEdit(null);
		setDialogOpen(true);
	}

	function openEditConnectionDialog(conn: ConnectionInfo) {
		setConnectionToEdit(conn);
		setDialogOpen(true);
	}

	// ── Global Ctrl+Shift+P shortcut ──────────────────────
	function handleGlobalKeyDown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "p") {
			e.preventDefault();
			setPaletteOpen((v) => !v);
		}
	}

	onMount(() => {
		document.addEventListener("keydown", handleGlobalKeyDown);
		registerCommands();
	});

	onCleanup(() => {
		document.removeEventListener("keydown", handleGlobalKeyDown);
	});

	// ── Command registration ──────────────────────────────
	function registerCommands() {
		commandRegistry.register({
			id: "command-palette",
			label: "Command Palette",
			shortcut: "Ctrl+Shift+P",
			category: "Navigation",
			handler: () => setPaletteOpen(true),
		});

		commandRegistry.register({
			id: "new-sql-console",
			label: "New SQL Console",
			category: "Query",
			handler: () => {
				const conn = connectionsStore.activeConnection;
				if (!conn) return;
				const tabId = tabsStore.openTab({
					type: "sql-console",
					title: `SQL — ${conn.name}`,
					connectionId: conn.id,
				});
				editorStore.initTab(tabId, conn.id);
			},
		});

		commandRegistry.register({
			id: "close-tab",
			label: "Close Tab",
			shortcut: "Ctrl+W",
			category: "Navigation",
			handler: () => {
				const tab = tabsStore.activeTab;
				if (tab) tabsStore.closeTab(tab.id);
			},
		});

		commandRegistry.register({
			id: "close-all-tabs",
			label: "Close All Tabs",
			category: "Navigation",
			handler: () => tabsStore.closeAllTabs(),
		});

		commandRegistry.register({
			id: "connect",
			label: "Connect",
			category: "Connection",
			handler: () => {
				const conn = connectionsStore.activeConnection;
				if (conn && conn.state === "disconnected") {
					connectionsStore.connectTo(conn.id);
				}
			},
		});

		commandRegistry.register({
			id: "disconnect",
			label: "Disconnect",
			category: "Connection",
			handler: () => {
				const conn = connectionsStore.activeConnection;
				if (conn && conn.state === "connected") {
					connectionsStore.disconnectFrom(conn.id);
				}
			},
		});

		commandRegistry.register({
			id: "format-sql",
			label: "Format SQL",
			shortcut: "Ctrl+Shift+F",
			category: "Query",
			handler: () => {
				const tab = tabsStore.activeTab;
				if (tab?.type === "sql-console") {
					editorStore.formatSql(tab.id);
				}
			},
		});

		commandRegistry.register({
			id: "run-query",
			label: "Run Query",
			shortcut: "Ctrl+Enter",
			category: "Query",
			handler: () => {
				const tab = tabsStore.activeTab;
				if (tab?.type === "sql-console") {
					editorStore.executeQuery(tab.id);
				}
			},
		});

		commandRegistry.register({
			id: "cancel-query",
			label: "Cancel Query",
			shortcut: "Escape",
			category: "Query",
			handler: () => {
				const tab = tabsStore.activeTab;
				if (tab?.type === "sql-console") {
					editorStore.cancelQuery(tab.id);
				}
			},
		});

		commandRegistry.register({
			id: "refresh-data",
			label: "Refresh Data",
			shortcut: "F5",
			category: "Grid",
			handler: () => {
				const tab = tabsStore.activeTab;
				if (tab?.type === "data-grid" && tab.schema && tab.table) {
					gridStore.loadTableData(tab.id, tab.connectionId, tab.schema, tab.table);
				}
			},
		});

		commandRegistry.register({
			id: "toggle-sidebar",
			label: "Toggle Sidebar",
			shortcut: "Ctrl+B",
			category: "View",
			handler: () => toggleCollapse(),
		});

		commandRegistry.register({
			id: "save-view",
			label: "Save View",
			shortcut: "Ctrl+S",
			category: "Grid",
			handler: () => {
				// Ctrl+S is handled directly in DataGrid for view saving;
				// dispatching the native shortcut event to trigger it
				document.dispatchEvent(new KeyboardEvent("keydown", { key: "s", ctrlKey: true }));
			},
		});

		commandRegistry.register({
			id: "export-data",
			label: "Export Data",
			category: "Grid",
			handler: () => {
				// Export is managed by the ExportDialog within DataGrid
				// This provides a discoverable entry point
			},
		});
	}

	return (
		<div class="app-shell">
			<div class="app-shell__body">
				<Show when={sidebarCollapsed()}>
					<SidebarExpandButton onClick={toggleCollapse} />
				</Show>

				<Sidebar
					width={sidebarWidth()}
					collapsed={sidebarCollapsed()}
					onToggleCollapse={toggleCollapse}
					onAdd={openAddConnectionDialog}
				>
					<ConnectionTree onAddConnection={openAddConnectionDialog} onEditConnection={openEditConnectionDialog} />
				</Sidebar>

				<Show when={!sidebarCollapsed()}>
					<Resizer onResize={handleResize} />
				</Show>

				<div class="app-shell__main">
					<TabBar
						tabs={tabsStore.openTabs}
						activeTabId={tabsStore.activeTabId}
						onSelectTab={tabsStore.setActiveTab}
						onCloseTab={tabsStore.closeTab}
						onCloseOtherTabs={tabsStore.closeOtherTabs}
						onCloseAllTabs={tabsStore.closeAllTabs}
						onRenameTab={tabsStore.renameTab}
					/>
					<main class="main-content">
						<Show when={tabsStore.openTabs.length === 0}>
							<div class="welcome-screen">
								<h2 class="welcome-screen__title">Dotaz</h2>
								<p class="welcome-screen__subtitle">
									Open a connection and select a table to get started.
								</p>
							</div>
						</Show>
						<Show when={tabsStore.activeTab}>
							{(tab) => (
								<Switch>
									<Match when={tab().type === "data-grid"}>
										<DataGrid
											tabId={tab().id}
											connectionId={tab().connectionId}
											schema={tab().schema!}
											table={tab().table!}
										/>
									</Match>
									<Match when={tab().type === "sql-console"}>
										<div class="sql-console">
											<QueryToolbar
												tabId={tab().id}
												connectionId={tab().connectionId}
												onOpenHistory={() => setHistoryOpen(true)}
											/>
											<SqlEditor
												tabId={tab().id}
												connectionId={tab().connectionId}
											/>
											<SqlResultPanel
												tabId={tab().id}
												connectionId={tab().connectionId}
											/>
										</div>
									</Match>
									<Match when={tab().type === "schema-viewer"}>
										<SchemaViewer
											tabId={tab().id}
											connectionId={tab().connectionId}
											schema={tab().schema!}
											table={tab().table!}
										/>
									</Match>
								</Switch>
							)}
						</Show>
					</main>
				</div>
			</div>

			<StatusBar />

			<ConnectionDialog
				open={dialogOpen()}
				connection={connectionToEdit()}
				onClose={() => setDialogOpen(false)}
			/>

			<QueryHistory
				open={historyOpen()}
				onClose={() => setHistoryOpen(false)}
			/>

			<CommandPalette
				open={paletteOpen()}
				onClose={() => setPaletteOpen(false)}
			/>
		</div>
	);
}
