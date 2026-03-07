import { For, type JSX, onCleanup, onMount, Show } from 'solid-js'
import './ContextMenu.css'

export interface ContextMenuItem {
	label: string
	icon?: () => JSX.Element
	action: () => void
	disabled?: boolean
}

export interface ContextMenuButtonRow {
	type: 'button-row'
	buttons: Array<{
		label: string
		icon?: () => JSX.Element
		action: () => void
		disabled?: boolean
		active?: boolean
	}>
}

export interface ContextMenuLabel {
	type: 'label'
	label: string
}

export type ContextMenuEntry = ContextMenuItem | ContextMenuButtonRow | ContextMenuLabel | 'separator'

interface ContextMenuProps {
	x: number
	y: number
	items: ContextMenuEntry[]
	onClose: () => void
}

export default function ContextMenu(props: ContextMenuProps) {
	let menuRef: HTMLDivElement | undefined

	function handleClickOutside(e: MouseEvent) {
		if (menuRef && !menuRef.contains(e.target as Node)) {
			props.onClose()
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			props.onClose()
		}
	}

	function clampPosition() {
		if (!menuRef) return
		const rect = menuRef.getBoundingClientRect()
		const maxX = window.innerWidth - rect.width
		const maxY = window.innerHeight - rect.height
		if (props.x > maxX) {
			menuRef.style.left = `${maxX}px`
		}
		if (props.y > maxY) {
			menuRef.style.top = `${maxY}px`
		}
	}

	onMount(() => {
		clampPosition()
		setTimeout(() => {
			document.addEventListener('mousedown', handleClickOutside)
		}, 0)
		document.addEventListener('keydown', handleKeyDown)
	})

	onCleanup(() => {
		document.removeEventListener('mousedown', handleClickOutside)
		document.removeEventListener('keydown', handleKeyDown)
	})

	return (
		<div
			ref={menuRef}
			class="context-menu"
			style={{ left: `${props.x}px`, top: `${props.y}px` }}
		>
			<For each={props.items}>
				{(item) => {
					if (item === 'separator') {
						return <div class="context-menu__separator" />
					}
					if ('type' in item && item.type === 'label') {
						return <div class="context-menu__label">{item.label}</div>
					}
					if ('type' in item && item.type === 'button-row') {
						return (
							<div class="context-menu__button-row">
								<For each={item.buttons}>
									{(btn) => (
										<button
											class="context-menu__btn"
											classList={{
												'context-menu__btn--disabled': btn.disabled,
												'context-menu__btn--active': btn.active,
											}}
											onClick={() => {
												if (!btn.disabled) {
													btn.action()
													props.onClose()
												}
											}}
										>
											<Show when={btn.icon}>
												<span class="context-menu__icon">{btn.icon!()}</span>
											</Show>
											{btn.label}
										</button>
									)}
								</For>
							</div>
						)
					}
					const menuItem = item as ContextMenuItem
					return (
						<button
							class="context-menu__item"
							classList={{ 'context-menu__item--disabled': menuItem.disabled }}
							onClick={() => {
								if (!menuItem.disabled) {
									menuItem.action()
									props.onClose()
								}
							}}
						>
							<Show when={menuItem.icon}>
								<span class="context-menu__icon">{menuItem.icon!()}</span>
							</Show>
							{menuItem.label}
						</button>
					)
				}}
			</For>
		</div>
	)
}
