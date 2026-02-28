import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import type { GridColumnDef } from "../../../shared/types/grid";
import type { ColumnConfig } from "../../stores/grid";
import "./ColumnManager.css";

interface ColumnManagerProps {
	columns: GridColumnDef[];
	columnConfig: Record<string, ColumnConfig>;
	columnOrder: string[];
	onToggleVisibility: (column: string, visible: boolean) => void;
	onTogglePin: (column: string, pinned: "left" | "right" | undefined) => void;
	onReorder: (order: string[]) => void;
	onReset: () => void;
}

export default function ColumnManager(props: ColumnManagerProps) {
	const [open, setOpen] = createSignal(false);
	const [dragIndex, setDragIndex] = createSignal<number | null>(null);
	const [dropTarget, setDropTarget] = createSignal<number | null>(null);
	let panelRef: HTMLDivElement | undefined;
	let triggerRef: HTMLButtonElement | undefined;

	function orderedColumns(): GridColumnDef[] {
		if (props.columnOrder.length === 0) return props.columns;
		const orderMap = new Map(props.columnOrder.map((name, i) => [name, i]));
		return [...props.columns].sort((a, b) => {
			const ai = orderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER;
			const bi = orderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER;
			return ai - bi;
		});
	}

	function visibleCount(): number {
		return props.columns.filter(
			(col) => props.columnConfig[col.name]?.visible !== false,
		).length;
	}

	function isVisible(col: string): boolean {
		return props.columnConfig[col]?.visible !== false;
	}

	function getPinned(col: string): "left" | "right" | undefined {
		return props.columnConfig[col]?.pinned;
	}

	function cyclePinned(col: string) {
		const current = getPinned(col);
		if (!current) {
			props.onTogglePin(col, "left");
		} else if (current === "left") {
			props.onTogglePin(col, "right");
		} else {
			props.onTogglePin(col, undefined);
		}
	}

	function pinLabel(col: string): string {
		const p = getPinned(col);
		if (p === "left") return "\u25C0";
		if (p === "right") return "\u25B6";
		return "\u2016";
	}

	function pinTitle(col: string): string {
		const p = getPinned(col);
		if (p === "left") return "Pinned left (click: pin right)";
		if (p === "right") return "Pinned right (click: unpin)";
		return "Pin left";
	}

	function handleDragStart(e: DragEvent, index: number) {
		setDragIndex(index);
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = "move";
		}
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = "move";
		}
		setDropTarget(index);
	}

	function handleDrop(e: DragEvent, targetIndex: number) {
		e.preventDefault();
		const fromIndex = dragIndex();
		if (fromIndex === null || fromIndex === targetIndex) {
			setDragIndex(null);
			setDropTarget(null);
			return;
		}

		const cols = orderedColumns().map((c) => c.name);
		const [moved] = cols.splice(fromIndex, 1);
		cols.splice(targetIndex, 0, moved);
		props.onReorder(cols);
		setDragIndex(null);
		setDropTarget(null);
	}

	function handleDragEnd() {
		setDragIndex(null);
		setDropTarget(null);
	}

	// Close on click outside
	createEffect(() => {
		if (open()) {
			const handler = (e: MouseEvent) => {
				const target = e.target as HTMLElement;
				if (
					panelRef &&
					!panelRef.contains(target) &&
					triggerRef &&
					!triggerRef.contains(target)
				) {
					setOpen(false);
				}
			};
			document.addEventListener("mousedown", handler);
			onCleanup(() => document.removeEventListener("mousedown", handler));
		}
	});

	return (
		<div class="column-manager">
			<button
				ref={triggerRef}
				class="column-manager__trigger"
				classList={{ "column-manager__trigger--active": open() }}
				onClick={() => setOpen(!open())}
				title="Manage columns"
			>
				<span class="column-manager__gear">{"\u2699"}</span>
				<span class="column-manager__count">
					{visibleCount()}/{props.columns.length}
				</span>
			</button>

			<Show when={open()}>
				<div ref={panelRef} class="column-manager__panel">
					<div class="column-manager__header">
						<span class="column-manager__header-label">
							{visibleCount()}/{props.columns.length} columns
						</span>
						<button
							class="column-manager__reset"
							onClick={props.onReset}
						>
							Reset to Default
						</button>
					</div>

					<div class="column-manager__list">
						<For each={orderedColumns()}>
							{(col, i) => (
								<div
									class="column-manager__item"
									classList={{
										"column-manager__item--hidden": !isVisible(col.name),
										"column-manager__item--drag-over": dropTarget() === i() && dragIndex() !== i(),
									}}
									draggable={true}
									onDragStart={(e) => handleDragStart(e, i())}
									onDragOver={(e) => handleDragOver(e, i())}
									onDrop={(e) => handleDrop(e, i())}
									onDragEnd={handleDragEnd}
								>
									<span class="column-manager__drag-handle">{"\u283F"}</span>

									<label class="column-manager__checkbox">
										<input
											type="checkbox"
											checked={isVisible(col.name)}
											onChange={(e) =>
												props.onToggleVisibility(
													col.name,
													e.currentTarget.checked,
												)
											}
										/>
									</label>

									<span class="column-manager__col-name">{col.name}</span>

									<button
										class="column-manager__pin-btn"
										classList={{
											"column-manager__pin-btn--active": !!getPinned(col.name),
											"column-manager__pin-btn--left": getPinned(col.name) === "left",
											"column-manager__pin-btn--right": getPinned(col.name) === "right",
										}}
										onClick={() => cyclePinned(col.name)}
										title={pinTitle(col.name)}
									>
										{pinLabel(col.name)}
									</button>
								</div>
							)}
						</For>
					</div>
				</div>
			</Show>
		</div>
	);
}
