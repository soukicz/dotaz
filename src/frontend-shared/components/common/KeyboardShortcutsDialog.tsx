import { For, Show } from 'solid-js'
import type { CommandCategory } from '../../lib/commands'
import { commandRegistry } from '../../lib/commands'
import Dialog from './Dialog'
import './KeyboardShortcutsDialog.css'

interface KeyboardShortcutsDialogProps {
	open: boolean
	onClose: () => void
}

interface ShortcutGroup {
	category: CommandCategory
	items: { label: string; shortcut: string }[]
}

const CATEGORY_ORDER: CommandCategory[] = ['Navigation', 'Query', 'Grid', 'View', 'Connection', 'Help']

function buildGroups(): ShortcutGroup[] {
	const all = commandRegistry.getAll()
	const withShortcut = all.filter((c) => c.shortcut)
	const map = new Map<CommandCategory, { label: string; shortcut: string }[]>()
	for (const cmd of withShortcut) {
		let list = map.get(cmd.category)
		if (!list) {
			list = []
			map.set(cmd.category, list)
		}
		list.push({ label: cmd.label, shortcut: cmd.shortcut! })
	}
	return CATEGORY_ORDER
		.filter((cat) => map.has(cat))
		.map((cat) => ({ category: cat, items: map.get(cat)! }))
}

export default function KeyboardShortcutsDialog(props: KeyboardShortcutsDialogProps) {
	return (
		<Show when={props.open}>
			{(() => {
				const groups = buildGroups()
				return (
					<Dialog open={true} onClose={props.onClose} title="Keyboard Shortcuts" class="keyboard-shortcuts-dialog">
						<div class="keyboard-shortcuts">
							<For each={groups}>
								{(group) => (
									<div class="keyboard-shortcuts__group">
										<h3 class="keyboard-shortcuts__category">{group.category}</h3>
										<For each={group.items}>
											{(item) => (
												<div class="keyboard-shortcuts__row">
													<span class="keyboard-shortcuts__label">{item.label}</span>
													<kbd class="keyboard-shortcuts__kbd">{item.shortcut}</kbd>
												</div>
											)}
										</For>
									</div>
								)}
							</For>
						</div>
					</Dialog>
				)
			})()}
		</Show>
	)
}
