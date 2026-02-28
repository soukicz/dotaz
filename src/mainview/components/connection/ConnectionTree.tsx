import { createSignal, For, Show } from "solid-js";
import type { ConnectionInfo, ConnectionState } from "../../../shared/types/connection";
import type { SchemaInfo, TableInfo } from "../../../shared/types/database";
import { connectionsStore } from "../../stores/connections";
import { tabsStore } from "../../stores/tabs";
import ConnectionTreeItem from "./ConnectionTreeItem";
import "./ConnectionTree.css";

interface ConnectionTreeProps {
	onAddConnection: () => void;
}

const STATUS_COLORS: Record<ConnectionState, string | undefined> = {
	connected: "var(--color-success)",
	connecting: "var(--color-warning)",
	error: "var(--color-error)",
	disconnected: undefined,
};

function getConnectionIcon(type: string): string {
	return type === "postgresql" ? "\uD83D\uDC18" : "\uD83D\uDDC4";
}

export default function ConnectionTree(props: ConnectionTreeProps) {
	const [expandedConnections, setExpandedConnections] = createSignal<Set<string>>(new Set());
	const [expandedSchemas, setExpandedSchemas] = createSignal<Set<string>>(new Set());

	function isConnectionExpanded(id: string): boolean {
		return expandedConnections().has(id);
	}

	function isSchemaExpanded(key: string): boolean {
		return expandedSchemas().has(key);
	}

	function toggleConnection(conn: ConnectionInfo) {
		if (conn.state === "disconnected" || conn.state === "error") {
			connectionsStore.connectTo(conn.id);
			// Expand when connecting
			setExpandedConnections((prev) => {
				const next = new Set(prev);
				next.add(conn.id);
				return next;
			});
			return;
		}

		setExpandedConnections((prev) => {
			const next = new Set(prev);
			if (next.has(conn.id)) {
				next.delete(conn.id);
			} else {
				next.add(conn.id);
			}
			return next;
		});
	}

	function toggleSchema(schemaKey: string) {
		setExpandedSchemas((prev) => {
			const next = new Set(prev);
			if (next.has(schemaKey)) {
				next.delete(schemaKey);
			} else {
				next.add(schemaKey);
			}
			return next;
		});
	}

	function handleTableClick(connectionId: string, schema: string, table: string) {
		tabsStore.openTab({
			type: "data-grid",
			title: table,
			connectionId,
			schema,
			table,
		});
	}

	function schemaKey(connectionId: string, schemaName: string): string {
		return `${connectionId}:${schemaName}`;
	}

	function isLoading(conn: ConnectionInfo): boolean {
		return conn.state === "connecting" ||
			(conn.state === "connected" && !connectionsStore.getSchemaTree(conn.id));
	}

	return (
		<div class="connection-tree">
			<Show
				when={connectionsStore.connections.length > 0}
				fallback={
					<div class="connection-tree__empty">
						<span>No connections</span>
						<button class="connection-tree__empty-cta" onClick={props.onAddConnection}>
							Add Connection
						</button>
					</div>
				}
			>
				<For each={connectionsStore.connections}>
					{(conn) => {
						const tree = () => connectionsStore.getSchemaTree(conn.id);
						const schemas = () => tree()?.schemas ?? [];
						const expanded = () => isConnectionExpanded(conn.id);
						const loading = () => isLoading(conn);
						const hasSchemas = () => conn.state === "connected" && schemas().length > 0;

						return (
							<>
								<ConnectionTreeItem
									label={conn.name}
									level={0}
									type="connection"
									icon={getConnectionIcon(conn.config.type)}
									expanded={expanded()}
									hasChildren={true}
									statusColor={STATUS_COLORS[conn.state]}
									loading={loading()}
									onClick={() => toggleConnection(conn)}
									onToggle={() => toggleConnection(conn)}
								/>

								<Show when={expanded() && !loading() && hasSchemas()}>
									<For each={schemas()}>
										{(schema: SchemaInfo) => {
											const sKey = () => schemaKey(conn.id, schema.name);
											const tables = () => tree()?.tables[schema.name] ?? [];
											const sExpanded = () => isSchemaExpanded(sKey());

											// For SQLite with only "main" schema, skip schema level
											const isSingleSchema = () => schemas().length === 1 && schema.name === "main";

											return (
												<Show
													when={!isSingleSchema()}
													fallback={
														<For each={tables()}>
															{(table: TableInfo) => (
																<ConnectionTreeItem
																	label={table.name}
																	level={1}
																	type="table"
																	icon={table.type === "view" ? "\u{1F441}" : "\u{1F4CB}"}
																	onClick={() => handleTableClick(conn.id, schema.name, table.name)}
																/>
															)}
														</For>
													}
												>
													<ConnectionTreeItem
														label={schema.name}
														level={1}
														type="schema"
														icon={"\uD83D\uDCC2"}
														expanded={sExpanded()}
														hasChildren={tables().length > 0}
														onToggle={() => toggleSchema(sKey())}
														onClick={() => toggleSchema(sKey())}
													/>

													<Show when={sExpanded()}>
														<For each={tables()}>
															{(table: TableInfo) => (
																<ConnectionTreeItem
																	label={table.name}
																	level={2}
																	type="table"
																	icon={table.type === "view" ? "\u{1F441}" : "\u{1F4CB}"}
																	onClick={() => handleTableClick(conn.id, schema.name, table.name)}
																/>
															)}
														</For>
													</Show>
												</Show>
											);
										}}
									</For>
								</Show>
							</>
						);
					}}
				</For>
			</Show>
		</div>
	);
}
