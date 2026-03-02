import { createSignal, createEffect, For, Show, Switch, Match } from "solid-js";
import type { QueryResult, QueryResultColumn } from "../../../shared/types/query";
import type { GridColumnDef } from "../../../shared/types/grid";
import type { ColumnConfig } from "../../stores/grid";
import { editorStore, type PinnedResultSet } from "../../stores/editor";
import ChevronUp from "lucide-solid/icons/chevron-up";
import ChevronDown from "lucide-solid/icons/chevron-down";
import Pin from "lucide-solid/icons/pin";
import PinOff from "lucide-solid/icons/pin-off";
import X from "lucide-solid/icons/x";
import GridHeader from "../grid/GridHeader";
import VirtualScroller from "../grid/VirtualScroller";
import ExplainPanel from "./ExplainPanel";
import Icon from "../common/Icon";
import "./SqlResultPanel.css";

interface SqlResultPanelProps {
	tabId: string;
	connectionId: string;
}

const HEADER_HEIGHT = 34;
const EMPTY_SORT: [] = [];
const EMPTY_PIN_STYLES = new Map<string, Record<string, string>>();
const EMPTY_FK_COLUMNS = new Set<string>();
const EMPTY_SELECTED_ROWS = new Set<number>();
const noop = () => {};

function toGridColumn(col: QueryResultColumn): GridColumnDef {
	return {
		name: col.name,
		dataType: col.dataType,
		nullable: false,
		isPrimaryKey: false,
	};
}

function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms} ms`;
	return `${(ms / 1000).toFixed(1)} s`;
}

function getResultLabel(result: QueryResult, index: number): string {
	if (result.error) return `Error`;
	if (result.columns.length > 0) return `Result ${index + 1}`;
	return `Statement ${index + 1}`;
}

export default function SqlResultPanel(props: SqlResultPanelProps) {
	const [activeResultIndex, setActiveResultIndex] = createSignal(0);
	const [minimized, setMinimized] = createSignal(false);

	const tab = () => editorStore.getTab(props.tabId);
	const pinnedResults = () => tab()?.pinnedResults ?? [];
	const activeResultView = () => tab()?.activeResultView ?? null;
	const hasPinnedTabs = () => pinnedResults().length > 0;

	// Current (unpinned) result data
	const currentResults = () => tab()?.results ?? [];
	const currentError = () => tab()?.error ?? null;
	const currentDuration = () => tab()?.duration ?? 0;
	const currentExplain = () => tab()?.explainResult ?? null;
	const currentHasContent = () => currentResults().length > 0 || currentError() !== null || currentExplain() !== null;

	// The viewed result set — either pinned or current
	const viewedPinned = (): PinnedResultSet | undefined => {
		const view = activeResultView();
		if (!view) return undefined;
		return pinnedResults().find((p) => p.id === view);
	};

	const isViewingPinned = () => activeResultView() !== null && viewedPinned() !== undefined;

	const results = () => {
		const pinned = viewedPinned();
		return pinned ? pinned.results : currentResults();
	};
	const error = () => {
		const pinned = viewedPinned();
		return pinned ? pinned.error : currentError();
	};
	const duration = () => {
		const pinned = viewedPinned();
		return pinned ? pinned.duration : currentDuration();
	};
	const explainResult = () => {
		const pinned = viewedPinned();
		return pinned ? pinned.explainResult : currentExplain();
	};
	const isRunning = () => tab()?.isRunning ?? false;

	createEffect(() => {
		results();
		setActiveResultIndex(0);
	});

	const activeResult = () => {
		const r = results();
		const idx = activeResultIndex();
		return idx < r.length ? r[idx] : undefined;
	};

	const hasContent = () => results().length > 0 || error() !== null || explainResult() !== null;
	const anyContent = () => hasContent() || currentHasContent() || hasPinnedTabs();

	return (
		<div
			class="sql-result-panel"
			classList={{ "sql-result-panel--minimized": minimized() }}
		>
			<Show when={anyContent() || isRunning()}>
				<div class="sql-result-panel__header">
					<div class="sql-result-panel__header-left">
						{/* Pinned result set tabs */}
						<Show when={hasPinnedTabs()}>
							<For each={pinnedResults()}>
								{(pinned, idx) => (
									<button
										class="sql-result-panel__result-tab"
										classList={{
											"sql-result-panel__result-tab--active": activeResultView() === pinned.id,
											"sql-result-panel__result-tab--pinned": true,
										}}
										onClick={() => editorStore.setActiveResultView(props.tabId, pinned.id)}
										title={`Pinned result ${idx() + 1}`}
									>
										<Pin size={10} />
										<span>Result {idx() + 1}</span>
										<button
											class="sql-result-panel__result-tab-close"
											onClick={(e) => {
												e.stopPropagation();
												editorStore.unpinResult(props.tabId, pinned.id);
											}}
											title="Unpin and close"
										>
											<X size={10} />
										</button>
									</button>
								)}
							</For>
							<button
								class="sql-result-panel__result-tab"
								classList={{
									"sql-result-panel__result-tab--active": activeResultView() === null,
								}}
								onClick={() => editorStore.setActiveResultView(props.tabId, null)}
								title="Current results"
							>
								<span>Current</span>
							</button>
						</Show>

						{/* Sub-tabs for multiple results within the active result set */}
						<Show when={!hasPinnedTabs() && explainResult()}>
							<span class="sql-result-panel__meta" style={{ "font-weight": "600", color: "var(--ink)" }}>
								Explain Plan
							</span>
						</Show>
						<Show when={!hasPinnedTabs() && !explainResult() && results().length > 1}>
							<For each={results()}>
								{(result, idx) => (
									<button
										class="sql-result-panel__tab"
										classList={{
											"sql-result-panel__tab--active":
												activeResultIndex() === idx(),
										}}
										onClick={() => setActiveResultIndex(idx())}
									>
										{getResultLabel(result, idx())}
									</button>
								)}
							</For>
						</Show>
					</div>

					<div class="sql-result-panel__header-right">
						<Show when={hasPinnedTabs() && explainResult()}>
							<span class="sql-result-panel__meta" style={{ "font-weight": "600", color: "var(--ink)" }}>
								Explain Plan
							</span>
						</Show>
						{/* Sub-tabs within pinned mode */}
						<Show when={hasPinnedTabs() && !explainResult() && results().length > 1}>
							<For each={results()}>
								{(result, idx) => (
									<button
										class="sql-result-panel__tab"
										classList={{
											"sql-result-panel__tab--active":
												activeResultIndex() === idx(),
										}}
										onClick={() => setActiveResultIndex(idx())}
									>
										{getResultLabel(result, idx())}
									</button>
								)}
							</For>
						</Show>
						<Show
							when={
								activeResult() &&
								!activeResult()!.error &&
								activeResult()!.columns.length > 0
							}
						>
							<span class="sql-result-panel__meta">
								{activeResult()!.rowCount} rows
							</span>
							<span class="sql-result-panel__meta-sep">&middot;</span>
							<span class="sql-result-panel__meta">
								{activeResult()!.columns.length} columns
							</span>
							<span class="sql-result-panel__meta-sep">&middot;</span>
						</Show>
						<Show when={hasContent()}>
							<span class="sql-result-panel__meta">
								{formatDuration(duration())}
							</span>
						</Show>
						{/* Pin button for current results */}
						<Show when={!isViewingPinned() && currentHasContent()}>
							<button
								class="sql-result-panel__pin-btn"
								onClick={() => editorStore.pinCurrentResult(props.tabId)}
								title="Pin current results"
							>
								<PinOff size={12} />
							</button>
						</Show>
						<button
							class="sql-result-panel__toggle"
							onClick={() => setMinimized((m) => !m)}
							title={minimized() ? "Expand results" : "Collapse results"}
						>
							{minimized() ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
						</button>
					</div>
				</div>
			</Show>

			<Show when={!minimized()}>
				<div class="sql-result-panel__content">
					<Switch>
						<Match when={!hasContent() && !isRunning()}>
							<div class="empty-state">
								<Icon name="sql-console" size={28} class="empty-state__icon" />
								<div class="empty-state__title">No results yet</div>
								<div class="empty-state__subtitle">Run a query to see results</div>
							</div>
						</Match>

						<Match when={!isViewingPinned() && isRunning()}>
							<div class="sql-result-panel__loading">
								<Icon name="spinner" size={14} />
								Running query...
							</div>
						</Match>

						<Match when={error()}>
							<div class="sql-result-panel__error">
								<div class="sql-result-panel__error-title">
									<Icon name="error" size={14} /> Error
								</div>
								<div class="sql-result-panel__error-message">{error()}</div>
							</div>
						</Match>

						<Match when={explainResult()}>
							{(result) => <ExplainPanel result={result()} />}
						</Match>

						<Match when={activeResult()}>
							{(result) => (
								<Switch>
									<Match when={result().error}>
										<div class="sql-result-panel__error">
											<div class="sql-result-panel__error-title">
												Error
												<Show when={result().errorPosition?.line != null}>
													<span class="sql-result-panel__error-position">
														{" "}at line {result().errorPosition!.line}
														<Show when={result().errorPosition!.column != null}>
															, column {result().errorPosition!.column}
														</Show>
													</span>
												</Show>
											</div>
											<div class="sql-result-panel__error-message">
												{result().error}
											</div>
										</div>
									</Match>

									<Match when={result().columns.length === 0}>
										<div class="sql-result-panel__dml">
											<span class="sql-result-panel__dml-count">
												{result().affectedRows ?? result().rowCount}
											</span>
											{" rows affected"}
										</div>
									</Match>

									<Match when={result().columns.length > 0}>
										<ResultGrid result={result()} />
									</Match>
								</Switch>
							)}
						</Match>
					</Switch>
				</div>
			</Show>
		</div>
	);
}

function ResultGrid(props: { result: QueryResult }) {
	const [scrollEl, setScrollEl] = createSignal<HTMLDivElement>();
	const [columnWidths, setColumnWidths] = createSignal<Record<string, number>>(
		{},
	);

	const columns = () => props.result.columns.map(toGridColumn);

	const columnConfig = (): Record<string, ColumnConfig> => {
		const widths = columnWidths();
		const config: Record<string, ColumnConfig> = {};
		for (const [name, width] of Object.entries(widths)) {
			config[name] = { visible: true, width };
		}
		return config;
	};

	function handleResizeColumn(column: string, width: number) {
		setColumnWidths((prev) => ({ ...prev, [column]: width }));
	}

	return (
		<div class="result-grid" ref={setScrollEl}>
			<GridHeader
				columns={columns()}
				sort={EMPTY_SORT}
				columnConfig={columnConfig()}
				pinStyles={EMPTY_PIN_STYLES}
				fkColumns={EMPTY_FK_COLUMNS}
				onToggleSort={noop}
				onResizeColumn={handleResizeColumn}
			/>
			<VirtualScroller
				scrollElement={scrollEl}
				rows={props.result.rows}
				columns={columns()}
				columnConfig={columnConfig()}
				pinStyles={EMPTY_PIN_STYLES}
				selectedRows={EMPTY_SELECTED_ROWS}
				scrollMargin={HEADER_HEIGHT}
				onRowClick={noop}
			/>
		</div>
	);
}
