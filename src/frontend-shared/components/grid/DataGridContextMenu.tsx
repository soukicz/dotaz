import { createSignal, Show } from 'solid-js'
import type { GridColumnDef } from '../../../shared/types/grid'
import { isNumericType } from '../../lib/column-types'
import type { FkTarget } from '../../stores/grid'
import { gridStore, isCellInSelection } from '../../stores/grid'
import { tabsStore } from '../../stores/tabs'
import type { ContextMenuEntry } from '../common/ContextMenu'
import ContextMenu from '../common/ContextMenu'

export interface DataGridContextMenuProps {
	tabId: string
	connectionId: string
	currentSchema: () => string
	currentTable: () => string
	database?: string
	fkMap: () => Map<string, FkTarget>
	visibleColumns: () => GridColumnDef[]
	isReadOnly: () => boolean
	onPaste: () => void
	onAdvancedCopy: () => void
	onDuplicateRow: (rowIndex: number) => void
	onFkClick: (rowIndex: number, column: string) => void
	onSetSidePanelOpen: (open: boolean) => void
}

export interface DataGridContextMenuHandle {
	handleGridContextMenu: (e: MouseEvent) => void
	handleHeaderContextMenu: (e: MouseEvent, column: string) => void
	closeContextMenus: () => void
}

export default function DataGridContextMenu(
	props: DataGridContextMenuProps & {
		ref?: (handle: DataGridContextMenuHandle) => void
	},
) {
	const [cellContextMenu, setCellContextMenu] = createSignal<
		{
			x: number
			y: number
			rowIndex: number
			column: string
		} | null
	>(null)

	const [headerContextMenu, setHeaderContextMenu] = createSignal<
		{
			x: number
			y: number
			column: string
		} | null
	>(null)

	const tab = () => gridStore.getTab(props.tabId)

	function handleGridContextMenu(e: MouseEvent) {
		const target = e.target as HTMLElement
		const cellEl = target.closest<HTMLElement>('[data-column]')
		if (!cellEl) return
		const columnName = cellEl.dataset.column
		if (!columnName) return

		const rowEl = target.closest<HTMLElement>('[data-row-index]')
		if (!rowEl) return
		const rowIndex = Number(rowEl.dataset.rowIndex)
		if (Number.isNaN(rowIndex)) return

		e.preventDefault()
		setHeaderContextMenu(null)

		const t = tab()
		if (t) {
			const cols = props.visibleColumns()
			const colIdx = cols.findIndex((c) => c.name === columnName)
			if (colIdx >= 0 && !isCellInSelection(t.selection, rowIndex, colIdx)) {
				gridStore.selectCell(props.tabId, rowIndex, colIdx)
			}
		}

		setCellContextMenu({
			x: e.clientX,
			y: e.clientY,
			rowIndex,
			column: columnName,
		})
	}

	function handleHeaderContextMenu(e: MouseEvent, column: string) {
		e.preventDefault()
		setCellContextMenu(null)
		setHeaderContextMenu({
			x: e.clientX,
			y: e.clientY,
			column,
		})
	}

	function closeContextMenus() {
		setCellContextMenu(null)
		setHeaderContextMenu(null)
	}

	// Expose handle to parent
	props.ref?.({
		handleGridContextMenu,
		handleHeaderContextMenu,
		closeContextMenus,
	})

	const cellContextMenuItems = (): ContextMenuEntry[] => {
		const ctx = cellContextMenu()
		if (!ctx) return []
		const t = tab()
		if (!t) return []
		const { rowIndex, column } = ctx
		const row = t.rows[rowIndex]
		const value = row?.[column]
		const isDeleted = gridStore.isRowDeleted(props.tabId, rowIndex)

		const ro = props.isReadOnly()
		const items: ContextMenuEntry[] = [
			{
				label: 'Copy Value',
				action: async () => {
					await navigator.clipboard.writeText(
						gridStore.formatCellForClipboard(value),
					)
				},
			},
			{
				label: 'Copy Row',
				action: async () => {
					const cols = props.visibleColumns()
					const header = cols.map((c) => c.name).join('\t')
					const rowText = cols
						.map((c) => gridStore.formatCellForClipboard(row[c.name]))
						.join('\t')
					await navigator.clipboard.writeText(`${header}\n${rowText}`)
				},
			},
			{
				label: 'Advanced Copy...',
				action: () => props.onAdvancedCopy(),
			},
			{
				label: 'Paste',
				action: () => props.onPaste(),
				disabled: isDeleted || ro,
			},
			'separator',
			{
				label: 'Edit Cell',
				action: () => gridStore.startEditing(props.tabId, rowIndex, column),
				disabled: isDeleted || ro,
			},
			{
				label: 'Set NULL',
				action: () => gridStore.setCellValue(props.tabId, rowIndex, column, null),
				disabled: isDeleted || ro,
			},
			'separator',
			{
				label: 'Filter by This Value',
				action: () => {
					const filterValue = value === null ? '' : String(value)
					const operator = value === null ? ('isNull' as const) : ('eq' as const)
					gridStore.setFilter(props.tabId, {
						column,
						operator,
						value: filterValue,
					})
				},
			},
			{
				label: 'Sort Ascending',
				action: () => gridStore.toggleSort(props.tabId, column, false),
			},
			{
				label: 'Sort Descending',
				action: () => {
					const existing = t?.sort.find((s) => s.column === column)
					if (!existing || existing.direction === 'desc') {
						gridStore.toggleSort(props.tabId, column, false)
					}
					gridStore.toggleSort(props.tabId, column, false)
				},
			},
			'separator',
			{
				label: 'Row Detail',
				action: () => {
					gridStore.selectFullRow(
						props.tabId,
						rowIndex,
						props.visibleColumns().length,
					)
					gridStore.closeFkPanel(props.tabId)
					props.onSetSidePanelOpen(true)
				},
			},
			{
				label: 'Open Row in Tab',
				action: () => {
					const pkCols = t.columns.filter((c) => c.isPrimaryKey)
					const pks: Record<string, unknown> = {}
					for (const pk of pkCols) {
						pks[pk.name] = row[pk.name]
					}
					tabsStore.openTab({
						type: 'row-detail',
						title: `${props.currentTable()} — ${Object.values(pks).join(', ')}`,
						connectionId: props.connectionId,
						schema: props.currentSchema(),
						table: props.currentTable(),
						database: props.database,
						primaryKeys: pks,
					})
				},
				disabled: t.columns.filter((c) => c.isPrimaryKey).length === 0
					|| gridStore.isRowNew(props.tabId, rowIndex),
			},
			{
				label: 'Delete Row',
				action: () => {
					gridStore.selectFullRow(
						props.tabId,
						rowIndex,
						props.visibleColumns().length,
					)
					gridStore.deleteSelectedRows(props.tabId)
				},
				disabled: isDeleted || ro,
			},
			{
				label: 'Duplicate Row',
				action: () => props.onDuplicateRow(rowIndex),
				disabled: ro,
			},
		]

		const fkTarget = props.fkMap().get(column)
		if (fkTarget && value !== null && value !== undefined) {
			items.push('separator')
			items.push({
				label: 'Peek referenced row',
				action: () => props.onFkClick(rowIndex, column),
			})
			items.push({
				label: `Open ${fkTarget.table} in Panel`,
				action: () => {
					const colIdx = props
						.visibleColumns()
						.findIndex((c) => c.name === column)
					if (colIdx >= 0) {
						gridStore.selectCell(props.tabId, rowIndex, colIdx)
					}
					gridStore.openFkPanel(props.tabId, fkTarget.schema, fkTarget.table, [
						{ column: fkTarget.column, operator: 'eq', value: String(value) },
					])
					props.onSetSidePanelOpen(true)
				},
			})
			items.push({
				label: `Open ${fkTarget.table} in Tab`,
				action: () => {
					tabsStore.openTab({
						type: 'data-grid',
						title: fkTarget.table,
						connectionId: props.connectionId,
						schema: fkTarget.schema,
						table: fkTarget.table,
						database: props.database,
					})
				},
			})
		}

		return items
	}

	const headerContextMenuItems = (): ContextMenuEntry[] => {
		const ctx = headerContextMenu()
		if (!ctx) return []
		const { column } = ctx
		const t = tab()
		const pinned = t?.columnConfig[column]?.pinned
		const colDef = t?.columns.find((c: GridColumnDef) => c.name === column)
		const isNumeric = colDef ? isNumericType(colDef.dataType) : false
		const currentHeatmap = t?.heatmapColumns[column]

		const items: ContextMenuEntry[] = [
			{
				label: 'Sort Ascending',
				action: () => gridStore.toggleSort(props.tabId, column, false),
			},
			{
				label: 'Sort Descending',
				action: () => {
					const existing = t?.sort.find((s) => s.column === column)
					if (!existing || existing.direction === 'desc') {
						gridStore.toggleSort(props.tabId, column, false)
					}
					gridStore.toggleSort(props.tabId, column, false)
				},
			},
			'separator',
			{
				label: 'Hide Column',
				action: () => gridStore.setColumnVisibility(props.tabId, column, false),
			},
			'separator',
			{
				label: 'Pin Left',
				action: () => gridStore.setColumnPinned(props.tabId, column, 'left'),
				disabled: pinned === 'left',
			},
			{
				label: 'Pin Right',
				action: () => gridStore.setColumnPinned(props.tabId, column, 'right'),
				disabled: pinned === 'right',
			},
			...(pinned
				? [
					{
						label: 'Unpin',
						action: () => gridStore.setColumnPinned(props.tabId, column, undefined),
					} as ContextMenuEntry,
				]
				: []),
			'separator',
			{
				label: 'Filter by Column',
				action: () => {
					gridStore.setFilter(props.tabId, {
						column,
						operator: 'isNotNull',
						value: '',
					})
				},
			},
		]

		if (isNumeric) {
			items.push('separator')
			items.push({
				label: 'Heatmap: Sequential',
				action: () => gridStore.setHeatmap(props.tabId, column, 'sequential'),
				disabled: currentHeatmap === 'sequential',
			})
			items.push({
				label: 'Heatmap: Diverging',
				action: () => gridStore.setHeatmap(props.tabId, column, 'diverging'),
				disabled: currentHeatmap === 'diverging',
			})
			if (currentHeatmap) {
				items.push({
					label: 'Remove Heatmap',
					action: () => gridStore.removeHeatmap(props.tabId, column),
				})
			}
		}

		return items
	}

	return (
		<>
			<Show when={cellContextMenu()}>
				{(_) => {
					const ctx = () => cellContextMenu()!
					return (
						<ContextMenu
							x={ctx().x}
							y={ctx().y}
							items={cellContextMenuItems()}
							onClose={closeContextMenus}
						/>
					)
				}}
			</Show>

			<Show when={headerContextMenu()}>
				{(_) => {
					const ctx = () => headerContextMenu()!
					return (
						<ContextMenu
							x={ctx().x}
							y={ctx().y}
							items={headerContextMenuItems()}
							onClose={closeContextMenus}
						/>
					)
				}}
			</Show>
		</>
	)
}
