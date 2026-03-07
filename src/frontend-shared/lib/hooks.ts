import { type Accessor, createEffect, onCleanup } from 'solid-js'

/**
 * Close a popover/dropdown when clicking outside of it.
 * @param isOpen - reactive accessor for the open state
 * @param refs - getter returning element refs to consider "inside" (panel + trigger)
 * @param onClose - callback to close
 * @param options.defer - if true, delays adding listener by a tick (for popovers opened by a click)
 */
export function useClickOutside(
	isOpen: Accessor<boolean>,
	refs: () => Array<HTMLElement | undefined>,
	onClose: () => void,
	options?: { defer?: boolean },
) {
	createEffect(() => {
		if (!isOpen()) return
		const handler = (e: MouseEvent) => {
			const target = e.target as Node
			const elements = refs()
			if (elements.some((ref) => !ref)) return
			if (elements.every((ref) => !ref!.contains(target))) {
				onClose()
			}
		}
		if (options?.defer) {
			const timer = setTimeout(() => {
				document.addEventListener('mousedown', handler)
			}, 0)
			onCleanup(() => {
				document.removeEventListener('mousedown', handler)
				clearTimeout(timer)
			})
		} else {
			document.addEventListener('mousedown', handler)
			onCleanup(() => document.removeEventListener('mousedown', handler))
		}
	})
}
