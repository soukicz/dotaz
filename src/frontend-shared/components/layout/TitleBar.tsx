import Minus from 'lucide-solid/icons/minus'
import Square from 'lucide-solid/icons/square'
import X from 'lucide-solid/icons/x'
import { Show } from 'solid-js'
import { closeWindow, maximizeWindow, minimizeWindow } from '../../lib/rpc'
import './TitleBar.css'

const isMac = navigator.platform.startsWith('Mac')

export default function TitleBar() {
	return (
		<div class={`titlebar electrobun-webkit-app-region-drag ${isMac ? 'titlebar--mac' : ''}`}>
			<Show when={isMac}>
				<div class="titlebar__traffic-lights electrobun-webkit-app-region-no-drag">
					<button class="titlebar__dot titlebar__dot--close" onClick={closeWindow} title="Close" />
					<button class="titlebar__dot titlebar__dot--minimize" onClick={minimizeWindow} title="Minimize" />
					<button class="titlebar__dot titlebar__dot--maximize" onClick={maximizeWindow} title="Maximize" />
				</div>
			</Show>
			<div class="titlebar__title">Dotaz</div>
			<Show when={!isMac}>
				<div class="titlebar__controls electrobun-webkit-app-region-no-drag">
					<button class="titlebar__btn" onClick={minimizeWindow} title="Minimize">
						<Minus size={14} />
					</button>
					<button class="titlebar__btn" onClick={maximizeWindow} title="Maximize">
						<Square size={12} />
					</button>
					<button class="titlebar__btn titlebar__btn--close" onClick={closeWindow} title="Close">
						<X size={14} />
					</button>
				</div>
			</Show>
		</div>
	)
}
