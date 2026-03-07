import { editorStore } from '../stores/editor'
import { tabsStore } from '../stores/tabs'

export function duplicateTab(tabId: string) {
	const sourceTab = tabsStore.openTabs.find((t) => t.id === tabId)
	if (!sourceTab) return

	if (sourceTab.type === 'sql-console') {
		const editorTab = editorStore.getTab(tabId)
		const newTabId = tabsStore.openTab({
			type: 'sql-console',
			title: sourceTab.title,
			connectionId: sourceTab.connectionId,
			database: sourceTab.database,
		})
		editorStore.initTab(newTabId, sourceTab.connectionId, sourceTab.database)
		if (editorTab?.content) {
			editorStore.setContent(newTabId, editorTab.content)
		}
	} else if (sourceTab.type === 'data-grid') {
		tabsStore.openTab({
			type: 'data-grid',
			title: sourceTab.title,
			connectionId: sourceTab.connectionId,
			schema: sourceTab.schema,
			table: sourceTab.table,
			database: sourceTab.database,
		})
	} else if (sourceTab.type === 'schema-viewer') {
		tabsStore.openTab({
			type: 'schema-viewer',
			title: sourceTab.title,
			connectionId: sourceTab.connectionId,
			schema: sourceTab.schema,
			table: sourceTab.table,
			database: sourceTab.database,
		})
	} else if (sourceTab.type === 'row-detail') {
		tabsStore.openTab({
			type: 'row-detail',
			title: sourceTab.title,
			connectionId: sourceTab.connectionId,
			schema: sourceTab.schema,
			table: sourceTab.table,
			database: sourceTab.database,
			primaryKeys: sourceTab.primaryKeys,
		})
	}
}
