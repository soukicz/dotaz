import { For, Show } from "solid-js";
import { createVirtualizer } from "@tanstack/solid-virtual";
import type { GridColumnDef } from "../../../shared/types/grid";
import type { ColumnConfig } from "../../stores/grid";
import GridRow from "./GridRow";
import "./VirtualScroller.css";

const ROW_HEIGHT = 32;
const OVERSCAN = 5;

interface VirtualScrollerProps {
	scrollElement: () => HTMLElement | undefined;
	rows: Record<string, unknown>[];
	columns: GridColumnDef[];
	columnConfig: Record<string, ColumnConfig>;
	pinStyles: Map<string, Record<string, string>>;
	selectedRows: Set<number>;
	scrollMargin: number;
	onRowClick: (index: number, e: MouseEvent) => void;
}

export default function VirtualScroller(props: VirtualScrollerProps) {
	const virtualizer = createVirtualizer({
		get count() {
			return props.rows.length;
		},
		getScrollElement: () => props.scrollElement() ?? null,
		estimateSize: () => ROW_HEIGHT,
		overscan: OVERSCAN,
		get scrollMargin() {
			return props.scrollMargin;
		},
	});

	return (
		<div
			class="virtual-scroller"
			style={{ height: `${virtualizer.getTotalSize()}px` }}
		>
			<Show when={props.rows.length === 0}>
				<div class="virtual-scroller__empty">No data</div>
			</Show>

			<For each={virtualizer.getVirtualItems()}>
				{(virtualRow) => (
					<GridRow
						row={props.rows[virtualRow.index]}
						index={virtualRow.index}
						columns={props.columns}
						columnConfig={props.columnConfig}
						pinStyles={props.pinStyles}
						selected={props.selectedRows.has(virtualRow.index)}
						onClick={props.onRowClick}
						style={{
							position: "absolute",
							top: `${virtualRow.start - virtualizer.options.scrollMargin}px`,
							left: "0",
							width: "100%",
							height: `${virtualRow.size}px`,
						}}
					/>
				)}
			</For>
		</div>
	);
}
