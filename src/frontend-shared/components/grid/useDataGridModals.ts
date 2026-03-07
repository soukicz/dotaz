import { createSignal } from 'solid-js'
import type { FkTarget } from '../../stores/grid'

export type DataGridModal =
	| null
	| { type: 'save-view'; forceNew: boolean }
	| { type: 'export'; scope?: 'selected' }
	| { type: 'import' }
	| { type: 'advanced-copy' }
	| { type: 'batch-edit' }
	| { type: 'paste-preview'; rows: string[][]; delimiter: string }
	| { type: 'fk-picker'; rowIndex: number; column: string; target: FkTarget }

export function useDataGridModals() {
	const [dgModal, setDgModal] = createSignal<DataGridModal>(null)

	function openSaveView(forceNew: boolean) {
		setDgModal({ type: 'save-view', forceNew })
	}

	function openExport(scope?: 'selected') {
		setDgModal({ type: 'export', scope })
	}

	function openImport() {
		setDgModal({ type: 'import' })
	}

	function openAdvancedCopy() {
		setDgModal({ type: 'advanced-copy' })
	}

	function openBatchEdit() {
		setDgModal({ type: 'batch-edit' })
	}

	function openPastePreview(rows: string[][], delimiter: string) {
		setDgModal({ type: 'paste-preview', rows, delimiter })
	}

	function openFkPicker(rowIndex: number, column: string, target: FkTarget) {
		setDgModal({ type: 'fk-picker', rowIndex, column, target })
	}

	function closeModal() {
		setDgModal(null)
	}

	return {
		dgModal,
		setDgModal,
		openSaveView,
		openExport,
		openImport,
		openAdvancedCopy,
		openBatchEdit,
		openPastePreview,
		openFkPicker,
		closeModal,
	}
}
