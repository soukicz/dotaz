import { type JSX, Show, onMount, onCleanup } from "solid-js";
import "./Dialog.css";

interface DialogProps {
	open: boolean;
	title: string;
	onClose: () => void;
	children: JSX.Element;
}

export default function Dialog(props: DialogProps) {
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			props.onClose();
		}
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			props.onClose();
		}
	}

	onMount(() => {
		document.addEventListener("keydown", handleKeyDown);
	});

	onCleanup(() => {
		document.removeEventListener("keydown", handleKeyDown);
	});

	return (
		<Show when={props.open}>
			<div class="dialog-overlay" onClick={handleOverlayClick}>
				<div class="dialog">
					<div class="dialog__header">
						<span class="dialog__title">{props.title}</span>
						<button
							class="dialog__close"
							onClick={props.onClose}
							title="Close"
						>
							&times;
						</button>
					</div>
					<div class="dialog__body">
						{props.children}
					</div>
				</div>
			</div>
		</Show>
	);
}
