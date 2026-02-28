import { createSignal, onMount, Show } from "solid-js";
import type { ColumnFilter } from "../../../shared/types/grid";
import { gridStore } from "../../stores/grid";
import { rpc } from "../../lib/rpc";
import GridHeader from "./GridHeader";
import VirtualScroller from "./VirtualScroller";
import FilterBar from "./FilterBar";
import ColumnManager from "./ColumnManager";
import Pagination from "./Pagination";
import "./DataGrid.css";

interface DataGridProps {
	tabId: string;
	connectionId: string;
	schema: string;
	table: string;
}

const HEADER_HEIGHT = 34; // 32px height + 2px border

export default function DataGrid(props: DataGridProps) {
	const [fkColumns, setFkColumns] = createSignal<Set<string>>(new Set());
	let scrollRef: HTMLDivElement | undefined;
	let anchorRow = -1;

	const tab = () => gridStore.getTab(props.tabId);

	const visibleColumns = () => {
		const t = tab();
		return t ? gridStore.getVisibleColumns(t) : [];
	};

	const pinStyles = () => {
		const t = tab();
		if (!t) return new Map<string, Record<string, string>>();
		return gridStore.computePinStyles(visibleColumns(), t.columnConfig);
	};

	onMount(async () => {
		const existing = gridStore.getTab(props.tabId);
		if (!existing || existing.columns.length === 0) {
			gridStore.loadTableData(props.tabId, props.connectionId, props.schema, props.table);
		}

		try {
			const fks = await rpc.schema.getForeignKeys(
				props.connectionId,
				props.schema,
				props.table,
			);
			const fkCols = new Set<string>();
			for (const fk of fks) {
				for (const col of fk.columns) {
					fkCols.add(col);
				}
			}
			setFkColumns(fkCols);
		} catch {
			// FK info is non-critical
		}
	});

	function handleToggleSort(column: string, multi: boolean) {
		gridStore.toggleSort(props.tabId, column, multi);
	}

	function handleResizeColumn(column: string, width: number) {
		gridStore.setColumnWidth(props.tabId, column, width);
	}

	function handleAddFilter(filter: ColumnFilter) {
		gridStore.setFilter(props.tabId, filter);
	}

	function handleRemoveFilter(column: string) {
		gridStore.removeFilter(props.tabId, column);
	}

	function handleClearFilters() {
		gridStore.clearFilters(props.tabId);
	}

	function handleRowClick(index: number, e: MouseEvent) {
		if (e.shiftKey && anchorRow >= 0) {
			gridStore.selectRange(props.tabId, anchorRow, index);
		} else if (e.ctrlKey || e.metaKey) {
			gridStore.toggleRowInSelection(props.tabId, index);
			if (anchorRow < 0) anchorRow = index;
		} else {
			gridStore.selectRow(props.tabId, index);
			anchorRow = index;
		}
	}

	return (
		<div class="data-grid">
			<div class="data-grid__toolbar">
				<Show when={tab()}>
					{(tabState) => (
						<>
							<FilterBar
								columns={tabState().columns}
								filters={tabState().filters}
								onAddFilter={handleAddFilter}
								onRemoveFilter={handleRemoveFilter}
								onClearAll={handleClearFilters}
							/>
							<ColumnManager
								columns={tabState().columns}
								columnConfig={tabState().columnConfig}
								columnOrder={tabState().columnOrder}
								onToggleVisibility={(col, visible) =>
									gridStore.setColumnVisibility(props.tabId, col, visible)
								}
								onTogglePin={(col, pinned) =>
									gridStore.setColumnPinned(props.tabId, col, pinned)
								}
								onReorder={(order) =>
									gridStore.setColumnOrder(props.tabId, order)
								}
								onReset={() => gridStore.resetColumnConfig(props.tabId)}
							/>
						</>
					)}
				</Show>
			</div>

			<Show when={tab()}>
				{(tabState) => (
					<>
						<Show when={tabState().loading}>
							<div class="data-grid__loading">
								<div class="data-grid__spinner" />
								Loading...
							</div>
						</Show>

						<div
							ref={scrollRef}
							class="data-grid__table-container"
							classList={{ "data-grid__table-container--loading": tabState().loading }}
						>
							<GridHeader
								columns={visibleColumns()}
								sort={tabState().sort}
								columnConfig={tabState().columnConfig}
								pinStyles={pinStyles()}
								fkColumns={fkColumns()}
								onToggleSort={handleToggleSort}
								onResizeColumn={handleResizeColumn}
							/>

							<VirtualScroller
								scrollElement={() => scrollRef}
								rows={tabState().rows}
								columns={visibleColumns()}
								columnConfig={tabState().columnConfig}
								pinStyles={pinStyles()}
								selectedRows={tabState().selectedRows}
								scrollMargin={HEADER_HEIGHT}
								onRowClick={handleRowClick}
							/>
						</div>

						<div class="data-grid__footer">
							<Pagination
								currentPage={tabState().currentPage}
								pageSize={tabState().pageSize}
								totalCount={tabState().totalCount}
								loading={tabState().loading}
								onPageChange={(page) => gridStore.setPage(props.tabId, page)}
								onPageSizeChange={(size) => gridStore.setPageSize(props.tabId, size)}
							/>
						</div>
					</>
				)}
			</Show>
		</div>
	);
}
