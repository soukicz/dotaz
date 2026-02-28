import { createSignal, onMount, Show } from "solid-js";
import { gridStore } from "../../stores/grid";
import { rpc } from "../../lib/rpc";
import GridHeader from "./GridHeader";
import VirtualScroller from "./VirtualScroller";
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
				{/* Toolbar placeholder -- FilterBar (DOTAZ-022), ColumnManager (DOTAZ-023) */}
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
								columns={tabState().columns}
								sort={tabState().sort}
								columnConfig={tabState().columnConfig}
								fkColumns={fkColumns()}
								onToggleSort={handleToggleSort}
								onResizeColumn={handleResizeColumn}
							/>

							<VirtualScroller
								scrollElement={() => scrollRef}
								rows={tabState().rows}
								columns={tabState().columns}
								columnConfig={tabState().columnConfig}
								selectedRows={tabState().selectedRows}
								scrollMargin={HEADER_HEIGHT}
								onRowClick={handleRowClick}
							/>
						</div>

						<div class="data-grid__footer">
							{/* Pagination placeholder -- DOTAZ-021 */}
							<Show when={tabState().totalCount > 0}>
								<span class="data-grid__footer-info">
									{tabState().rows.length} of {tabState().totalCount} rows
								</span>
							</Show>
						</div>
					</>
				)}
			</Show>
		</div>
	);
}
