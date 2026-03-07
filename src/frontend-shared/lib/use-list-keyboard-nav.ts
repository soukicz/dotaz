/**
 * Creates a keyboard handler for arrow key navigation in lists.
 * Returns a handler that processes ArrowUp, ArrowDown, and Enter.
 * Returns true if the key was handled, false otherwise.
 */
export function createListKeyboardHandler(options: {
	getItemCount: () => number
	getSelectedIndex: () => number
	setSelectedIndex: (i: number) => void
	onConfirm: () => void
	scrollIntoView?: () => void
}): (e: KeyboardEvent) => boolean {
	return (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowDown': {
				e.preventDefault()
				options.setSelectedIndex(Math.min(options.getSelectedIndex() + 1, options.getItemCount() - 1))
				options.scrollIntoView?.()
				return true
			}
			case 'ArrowUp': {
				e.preventDefault()
				options.setSelectedIndex(Math.max(options.getSelectedIndex() - 1, 0))
				options.scrollIntoView?.()
				return true
			}
			case 'Enter': {
				e.preventDefault()
				options.onConfirm()
				return true
			}
		}
		return false
	}
}
