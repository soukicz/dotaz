import { commandRegistry } from './commands'
import { platformShortcut } from './keyboard'
import { connectionsStore } from '../stores/connections'
import { editorStore } from '../stores/editor'
import { gridStore } from '../stores/grid'
import { navigationStore } from '../stores/navigation'
import { tabsStore } from '../stores/tabs'
import { uiStore } from '../stores/ui'

export interface AppCommandActions {
	toggleModal: (type: string) => void
	setModal: (modal: { type: string; [key: string]: unknown } | null) => void
	openAddConnectionDialog: () => void
	toggleCollapse: () => void
	sidebarCollapsed: () => boolean
}

export function registerAppCommands(actions: AppCommandActions): void {
	commandRegistry.register({
		id: 'command-palette',
		label: 'Command Palette',
		shortcut: 'Ctrl+Shift+P',
		category: 'Navigation',
		handler: () => actions.toggleModal('palette'),
	})

	commandRegistry.register({
		id: 'tab-switcher',
		label: 'Switch Tab',
		shortcut: platformShortcut('tab-switcher'),
		category: 'Navigation',
		handler: () => actions.toggleModal('tab-switcher'),
	})

	commandRegistry.register({
		id: 'new-sql-console',
		label: 'New SQL Console',
		shortcut: platformShortcut('new-sql-console'),
		category: 'Query',
		handler: () => {
			const conn = connectionsStore.activeConnection
			if (!conn) return
			const activeTab = tabsStore.activeTab
			const database = activeTab?.connectionId === conn.id ? activeTab?.database : undefined
			const label = database ?? conn.name
			const tabId = tabsStore.openTab({
				type: 'sql-console',
				title: `SQL — ${label}`,
				connectionId: conn.id,
				database,
			})
			editorStore.initTab(tabId, conn.id, database)
		},
	})

	commandRegistry.register({
		id: 'close-tab',
		label: 'Close Tab',
		shortcut: platformShortcut('close-tab'),
		category: 'Navigation',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab) tabsStore.closeTab(tab.id)
		},
	})

	commandRegistry.register({
		id: 'close-all-tabs',
		label: 'Close All Tabs',
		category: 'Navigation',
		handler: () => tabsStore.closeAllTabs(),
	})

	commandRegistry.register({
		id: 'next-tab',
		label: 'Next Tab',
		shortcut: platformShortcut('next-tab'),
		category: 'Navigation',
		handler: () => tabsStore.activateNextTab(),
	})

	commandRegistry.register({
		id: 'prev-tab',
		label: 'Previous Tab',
		shortcut: platformShortcut('prev-tab'),
		category: 'Navigation',
		handler: () => tabsStore.activatePrevTab(),
	})

	commandRegistry.register({
		id: 'navigate-back',
		label: 'Navigate Back',
		shortcut: 'Alt+ArrowLeft',
		category: 'Navigation',
		handler: () => navigationStore.goBack(),
	})

	commandRegistry.register({
		id: 'navigate-forward',
		label: 'Navigate Forward',
		shortcut: 'Alt+ArrowRight',
		category: 'Navigation',
		handler: () => navigationStore.goForward(),
	})

	commandRegistry.register({
		id: 'connect',
		label: 'Connect',
		category: 'Connection',
		handler: () => {
			const conn = connectionsStore.activeConnection
			if (conn && conn.state === 'disconnected') {
				connectionsStore.connectTo(conn.id)
			}
		},
	})

	commandRegistry.register({
		id: 'disconnect',
		label: 'Disconnect',
		category: 'Connection',
		handler: () => {
			const conn = connectionsStore.activeConnection
			if (conn && conn.state === 'connected') {
				connectionsStore.disconnectFrom(conn.id)
			}
		},
	})

	commandRegistry.register({
		id: 'format-sql',
		label: 'Format SQL',
		shortcut: 'Ctrl+Shift+F',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'sql-console') {
				editorStore.formatSql(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'bookmark-query',
		label: 'Bookmark Query',
		shortcut: 'Ctrl+D',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'sql-console') {
				const editorTab = editorStore.getTab(tab.id)
				const sql = editorTab?.content.trim()
				actions.setModal({ type: 'bookmarks', sql: sql || undefined, connId: tab.connectionId, db: tab.database })
			}
		},
	})

	commandRegistry.register({
		id: 'open-bookmarks',
		label: 'Open Bookmarks',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			actions.setModal({
				type: 'bookmarks',
				connId: tab?.connectionId,
				db: tab?.type === 'sql-console' ? tab.database : undefined,
			})
		},
	})

	commandRegistry.register({
		id: 'run-query',
		label: 'Run Query',
		shortcut: 'Ctrl+Enter',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'sql-console') {
				editorStore.executeQuery(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'cancel-query',
		label: 'Cancel Query',
		shortcut: 'Escape',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'sql-console') {
				editorStore.cancelQuery(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'commit-transaction',
		label: 'Commit Transaction',
		shortcut: 'Ctrl+Shift+Enter',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'sql-console') {
				editorStore.commitTransaction(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'rollback-transaction',
		label: 'Rollback Transaction',
		shortcut: 'Ctrl+Shift+R',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'sql-console') {
				editorStore.rollbackTransaction(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'refresh-data',
		label: 'Refresh Data',
		shortcut: 'F5',
		category: 'Grid',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'data-grid') {
				gridStore.refreshData(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'toggle-sidebar',
		label: 'Toggle Sidebar',
		shortcut: 'Ctrl+B',
		category: 'View',
		handler: () => actions.toggleCollapse(),
	})

	commandRegistry.register({
		id: 'focus-navigator-filter',
		label: 'Filter in Navigator',
		shortcut: 'Ctrl+Shift+L',
		category: 'Navigation',
		handler: () => {
			// Ensure sidebar is visible first
			if (actions.sidebarCollapsed()) actions.toggleCollapse()
			window.dispatchEvent(new CustomEvent('dotaz:focus-navigator-filter'))
		},
	})

	commandRegistry.register({
		id: 'save-view',
		label: 'Save View',
		shortcut: 'Ctrl+S',
		category: 'Grid',
		handler: () => {
			// Dispatched as custom event so DataGrid (which owns the save dialog) can handle it
			const tab = tabsStore.activeTab
			if (tab?.type === 'data-grid') {
				window.dispatchEvent(
					new CustomEvent('dotaz:save-view', { detail: { tabId: tab.id } }),
				)
			}
		},
	})

	commandRegistry.register({
		id: 'inline-edit',
		label: 'Edit Cell',
		shortcut: 'F2',
		category: 'Grid',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type !== 'data-grid') return
			const gridTab = gridStore.getTab(tab.id)
			const focused = gridTab?.selection.focusedCell
			if (!focused) return
			const visibleCols = gridStore.getVisibleColumns(gridTab)
			const col = visibleCols[focused.col]
			if (!col) return
			if (gridStore.isRowDeleted(tab.id, focused.row)) return
			gridStore.startEditing(tab.id, focused.row, col.name)
		},
	})

	commandRegistry.register({
		id: 'delete-rows',
		label: 'Delete Selected Rows',
		shortcut: 'Delete',
		category: 'Grid',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'data-grid') {
				gridStore.deleteSelectedRows(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'export-data',
		label: 'Export Data',
		category: 'Grid',
		handler: () => {
			// Export is managed by the ExportDialog within DataGrid
		},
	})

	commandRegistry.register({
		id: 'toggle-transpose',
		label: 'Toggle Transpose View',
		shortcut: 'Ctrl+Shift+T',
		category: 'Grid',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'data-grid') {
				gridStore.toggleTranspose(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'toggle-value-editor',
		label: 'Toggle Value Editor Panel',
		shortcut: 'Ctrl+Shift+E',
		category: 'Grid',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'data-grid') {
				gridStore.toggleValueEditor(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'compare-data',
		label: 'Compare Data',
		category: 'Grid',
		handler: () => {
			const tab = tabsStore.activeTab
			const initialLeft = tab?.type === 'data-grid' && tab.schema && tab.table
				? { connectionId: tab.connectionId, schema: tab.schema, table: tab.table, database: tab.database }
				: undefined
			actions.setModal({ type: 'compare', initialLeft })
		},
	})

	commandRegistry.register({
		id: 'search-database',
		label: 'Search Database',
		category: 'Connection',
		handler: () => {
			const conn = connectionsStore.activeConnection
			actions.setModal({ type: 'search', connId: conn?.id })
		},
	})

	commandRegistry.register({
		id: 'new-connection',
		label: 'New Connection',
		category: 'Connection',
		handler: () => actions.openAddConnectionDialog(),
	})

	commandRegistry.register({
		id: 'reconnect',
		label: 'Reconnect',
		category: 'Connection',
		handler: async () => {
			const conn = connectionsStore.activeConnection
			if (!conn) return
			if (conn.state === 'connected') {
				await connectionsStore.disconnectFrom(conn.id)
			}
			connectionsStore.connectTo(conn.id)
		},
	})

	commandRegistry.register({
		id: 'zoom-in',
		label: 'Zoom In',
		category: 'View',
		shortcut: 'Ctrl+=',
		handler: () => {
			const current = parseFloat(document.documentElement.style.zoom || '1')
			document.documentElement.style.zoom = String(
				Math.min(current + 0.1, 2),
			)
		},
	})

	commandRegistry.register({
		id: 'zoom-out',
		label: 'Zoom Out',
		category: 'View',
		shortcut: 'Ctrl+-',
		handler: () => {
			const current = parseFloat(document.documentElement.style.zoom || '1')
			document.documentElement.style.zoom = String(
				Math.max(current - 0.1, 0.5),
			)
		},
	})

	commandRegistry.register({
		id: 'zoom-reset',
		label: 'Reset Zoom',
		category: 'View',
		shortcut: 'Ctrl+0',
		handler: () => {
			document.documentElement.style.zoom = '1'
		},
	})

	commandRegistry.register({
		id: 'about',
		label: 'About Dotaz',
		category: 'Help',
		handler: () => {
			uiStore.addToast('info', 'Dotaz — Desktop Database Client')
		},
	})

	commandRegistry.register({
		id: 'keyboard-shortcuts',
		label: 'Keyboard Shortcuts',
		shortcut: 'Ctrl+/',
		category: 'Help',
		handler: () => actions.toggleModal('keyboard-shortcuts'),
	})

	commandRegistry.register({
		id: 'settings',
		label: 'Settings',
		category: 'View',
		handler: () => actions.setModal({ type: 'settings', section: 'data-format' }),
	})

	commandRegistry.register({
		id: 'settings-data-format',
		label: 'Settings: Data Format',
		category: 'View',
		handler: () => actions.setModal({ type: 'settings', section: 'data-format' }),
	})

	commandRegistry.register({
		id: 'ai-generate-sql',
		label: 'Generate SQL with AI',
		shortcut: 'Ctrl+G',
		category: 'Query',
		handler: () => {
			const tab = tabsStore.activeTab
			if (tab?.type === 'sql-console') {
				editorStore.toggleAiPrompt(tab.id)
			}
		},
	})

	commandRegistry.register({
		id: 'ai-settings',
		label: 'Settings: AI',
		category: 'View',
		handler: () => actions.setModal({ type: 'settings', section: 'ai' }),
	})

	commandRegistry.register({
		id: 'session-settings',
		label: 'Settings: Session',
		category: 'View',
		handler: () => actions.setModal({ type: 'settings', section: 'session' }),
	})
}
