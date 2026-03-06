import ChevronLeft from 'lucide-solid/icons/chevron-left'
import ChevronRight from 'lucide-solid/icons/chevron-right'
import X from 'lucide-solid/icons/x'
import { For, Show } from 'solid-js'
import type { ForeignKeyInfo } from '../../../shared/types/database'
import type { FkPanelState } from '../../stores/grid'
import Resizer from '../layout/Resizer'
import './FkExplorationPanel.css'

interface FkExplorationPanelProps {
	panel: FkPanelState
	onClose: () => void
	onNavigate: (schema: string, table: string, column: string, value: unknown) => void
	onBack: () => void
	onResize: (delta: number) => void
	onPageChange: (page: number) => void
	onRowIndexChange: (index: number) => void
}

function buildFkLookup(foreignKeys: ForeignKeyInfo[]): Map<string, { schema: string; table: string; column: string }> {
	const map = new Map<string, { schema: string; table: string; column: string }>()
	for (const fk of foreignKeys) {
		if (fk.columns.length === 1) {
			map.set(fk.columns[0], {
				schema: fk.referencedSchema,
				table: fk.referencedTable,
				column: fk.referencedColumns[0],
			})
		}
	}
	return map
}

function formatDisplayValue(value: unknown): string {
	if (value === null || value === undefined) return 'NULL'
	if (typeof value === 'object') return JSON.stringify(value)
	const str = String(value)
	return str.length > 200 ? str.slice(0, 200) + '...' : str
}

export default function FkExplorationPanel(props: FkExplorationPanelProps) {
	const fkLookup = () => buildFkLookup(props.panel.foreignKeys)
	const hasBreadcrumbs = () => props.panel.breadcrumbs.length > 1
	const totalPages = () => Math.max(1, Math.ceil(props.panel.totalCount / props.panel.pageSize))

	const currentRow = () => props.panel.rows[props.panel.currentRowIndex]
	const rowCount = () => props.panel.rows.length

	// Global row number (across pages)
	const globalRowNumber = () => (props.panel.currentPage - 1) * props.panel.pageSize + props.panel.currentRowIndex + 1

	const canPrevRow = () => props.panel.currentRowIndex > 0 || props.panel.currentPage > 1
	const canNextRow = () => props.panel.currentRowIndex < rowCount() - 1 || props.panel.currentPage < totalPages()

	const filterBadge = () => {
		const filters = props.panel.filters
		if (filters.length === 0) return ''
		return filters.map((f) => `${f.column} = ${f.value}`).join(', ')
	}

	function handlePrevRow() {
		if (props.panel.currentRowIndex > 0) {
			props.onRowIndexChange(props.panel.currentRowIndex - 1)
		} else if (props.panel.currentPage > 1) {
			// Go to previous page, last row
			props.onPageChange(props.panel.currentPage - 1)
		}
	}

	function handleNextRow() {
		if (props.panel.currentRowIndex < rowCount() - 1) {
			props.onRowIndexChange(props.panel.currentRowIndex + 1)
		} else if (props.panel.currentPage < totalPages()) {
			// Go to next page, first row
			props.onPageChange(props.panel.currentPage + 1)
		}
	}

	function handleFkValueClick(colName: string, value: unknown) {
		const fk = fkLookup().get(colName)
		if (!fk || value === null || value === undefined) return
		props.onNavigate(fk.schema, fk.table, fk.column, value)
	}

	return (
		<>
			<Resizer onResize={(delta) => props.onResize(-delta)} />
			<div class="fk-panel" style={{ width: `${props.panel.width}px` }}>
				{/* Breadcrumbs */}
				<Show when={hasBreadcrumbs()}>
					<div class="fk-panel__breadcrumbs">
						<button
							class="fk-panel__breadcrumb-back"
							onClick={props.onBack}
							title="Go back"
						>
							<ChevronLeft size={12} />
						</button>
						<For each={props.panel.breadcrumbs.slice(0, -1)}>
							{(bc) => (
								<>
									<span class="fk-panel__breadcrumb-item">{bc.table}</span>
									<span class="fk-panel__breadcrumb-sep">&#8250;</span>
								</>
							)}
						</For>
						<span class="fk-panel__breadcrumb-current">{props.panel.table}</span>
					</div>
				</Show>

				{/* Header */}
				<div class="fk-panel__header">
					<div class="fk-panel__header-info">
						<span class="fk-panel__table-name">{props.panel.table}</span>
						<Show when={filterBadge()}>
							<span class="fk-panel__filter-badge">{filterBadge()}</span>
						</Show>
					</div>
					<button class="fk-panel__close-btn" onClick={props.onClose} title="Close panel">
						<X size={14} />
					</button>
				</div>

				{/* Body — vertical field list */}
				<div class="fk-panel__body">
					<Show when={props.panel.loading}>
						<div class="fk-panel__loading">Loading...</div>
					</Show>
					<Show when={!props.panel.loading && props.panel.rows.length === 0}>
						<div class="fk-panel__empty">No data</div>
					</Show>
					<Show when={!props.panel.loading && currentRow()}>
						<For each={props.panel.columns}>
							{(col) => {
								const value = () => currentRow()?.[col.name]
								const isFk = () => fkLookup().has(col.name) && value() !== null && value() !== undefined
								const isNull = () => value() === null || value() === undefined
								return (
									<div class="fk-panel__field">
										<span class="fk-panel__field-name" title={col.name}>{col.name}</span>
										<span
											class="fk-panel__field-value"
											classList={{
												'fk-panel__field-value--null': isNull(),
												'fk-panel__field-value--fk': isFk(),
											}}
											onClick={isFk() ? () => handleFkValueClick(col.name, value()) : undefined}
											title={isFk() ? `Go to ${fkLookup().get(col.name)!.table}` : formatDisplayValue(value())}
										>
											{formatDisplayValue(value())}
										</span>
									</div>
								)
							}}
						</For>
					</Show>
				</div>

				{/* Footer — row navigation */}
				<div class="fk-panel__footer">
					<div class="fk-panel__page-info">
						{props.panel.totalCount} row{props.panel.totalCount !== 1 ? 's' : ''}
					</div>
					<Show when={props.panel.totalCount > 1}>
						<div class="fk-panel__page-controls">
							<button
								class="fk-panel__page-btn"
								disabled={!canPrevRow()}
								onClick={handlePrevRow}
							>
								<ChevronLeft size={12} />
							</button>
							<span>{globalRowNumber()} / {props.panel.totalCount}</span>
							<button
								class="fk-panel__page-btn"
								disabled={!canNextRow()}
								onClick={handleNextRow}
							>
								<ChevronRight size={12} />
							</button>
						</div>
					</Show>
				</div>
			</div>
		</>
	)
}
