import { For } from "solid-js";
import type { GridColumnDef } from "../../../shared/types/grid";
import type { ColumnConfig } from "../../stores/grid";
import GridCell from "./GridCell";
import "./GridRow.css";

interface GridRowProps {
	row: Record<string, unknown>;
	index: number;
	columns: GridColumnDef[];
	columnConfig: Record<string, ColumnConfig>;
	selected: boolean;
	onClick: (index: number, e: MouseEvent) => void;
	style?: Record<string, string>;
}

const DEFAULT_COLUMN_WIDTH = 150;

function getColumnWidth(col: string, config: Record<string, ColumnConfig>): number {
	return config[col]?.width ?? DEFAULT_COLUMN_WIDTH;
}

export default function GridRow(props: GridRowProps) {
	function handleClick(e: MouseEvent) {
		props.onClick(props.index, e);
	}

	return (
		<div
			class="grid-row"
			classList={{
				"grid-row--selected": props.selected,
				"grid-row--even": props.index % 2 === 0,
				"grid-row--odd": props.index % 2 !== 0,
			}}
			style={props.style}
			onClick={handleClick}
		>
			<For each={props.columns}>
				{(col) => (
					<GridCell
						value={props.row[col.name]}
						column={col}
						width={getColumnWidth(col.name, props.columnConfig)}
					/>
				)}
			</For>
		</div>
	);
}
