import { createSignal, createEffect, createMemo } from "solid-js";
import Dialog from "./Dialog";
import { settingsStore } from "../../stores/settings";
import type {
	FormatProfile,
	DateFormat,
	DecimalSeparator,
	ThousandsSeparator,
	NullDisplay,
	BooleanDisplay,
	BinaryDisplay,
} from "../../../shared/types/settings";
import "./FormatSettingsDialog.css";

interface FormatSettingsDialogProps {
	open: boolean;
	onClose: () => void;
}

export default function FormatSettingsDialog(props: FormatSettingsDialogProps) {
	const [dateFormat, setDateFormat] = createSignal<DateFormat>("YYYY-MM-DD HH:mm:ss");
	const [decimalSeparator, setDecimalSeparator] = createSignal<DecimalSeparator>(".");
	const [thousandsSeparator, setThousandsSeparator] = createSignal<ThousandsSeparator>("");
	const [decimalPlaces, setDecimalPlaces] = createSignal(-1);
	const [nullDisplay, setNullDisplay] = createSignal<NullDisplay>("NULL");
	const [booleanDisplay, setBooleanDisplay] = createSignal<BooleanDisplay>("true/false");
	const [binaryDisplay, setBinaryDisplay] = createSignal<BinaryDisplay>("size");

	// Load current values when dialog opens
	createEffect(() => {
		if (props.open) {
			const p = settingsStore.formatProfile;
			setDateFormat(p.dateFormat);
			setDecimalSeparator(p.decimalSeparator);
			setThousandsSeparator(p.thousandsSeparator);
			setDecimalPlaces(p.decimalPlaces);
			setNullDisplay(p.nullDisplay);
			setBooleanDisplay(p.booleanDisplay);
			setBinaryDisplay(p.binaryDisplay);
		}
	});

	const numberPreview = createMemo(() => {
		const num = 1234567.891;
		return formatNumberPreview(num, decimalSeparator(), thousandsSeparator(), decimalPlaces());
	});

	const datePreview = createMemo(() => {
		const now = new Date(2026, 2, 2, 14, 30, 45);
		return formatDatePreview(now, dateFormat());
	});

	function handleSave() {
		const profile: FormatProfile = {
			dateFormat: dateFormat(),
			decimalSeparator: decimalSeparator(),
			thousandsSeparator: thousandsSeparator(),
			decimalPlaces: decimalPlaces(),
			nullDisplay: nullDisplay(),
			booleanDisplay: booleanDisplay(),
			binaryDisplay: binaryDisplay(),
		};
		settingsStore.saveFormatProfile(profile);
		props.onClose();
	}

	return (
		<Dialog open={props.open} title="Data Format Settings" onClose={props.onClose}>
			<div class="fmt-dialog">
				{/* Date/Time */}
				<div class="fmt-dialog__section">
					<h4 class="fmt-dialog__section-title">Date & Time</h4>
					<div class="fmt-dialog__field fmt-dialog__field--inline">
						<label class="fmt-dialog__label">Display format</label>
						<select
							class="fmt-dialog__select"
							value={dateFormat()}
							onChange={(e) => setDateFormat(e.currentTarget.value as DateFormat)}
						>
							<option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
							<option value="DD.MM.YYYY HH:mm:ss">DD.MM.YYYY HH:mm:ss</option>
							<option value="MM/DD/YYYY HH:mm:ss">MM/DD/YYYY HH:mm:ss</option>
							<option value="YYYY-MM-DD">YYYY-MM-DD (date only)</option>
							<option value="ISO 8601">ISO 8601</option>
						</select>
					</div>
					<div class="fmt-dialog__preview">Preview: {datePreview()}</div>
				</div>

				{/* Numbers */}
				<div class="fmt-dialog__section">
					<h4 class="fmt-dialog__section-title">Numbers</h4>
					<div class="fmt-dialog__field fmt-dialog__field--inline">
						<label class="fmt-dialog__label">Decimal separator</label>
						<select
							class="fmt-dialog__select"
							value={decimalSeparator()}
							onChange={(e) => setDecimalSeparator(e.currentTarget.value as DecimalSeparator)}
						>
							<option value=".">Dot (.)</option>
							<option value=",">Comma (,)</option>
						</select>
					</div>
					<div class="fmt-dialog__field fmt-dialog__field--inline">
						<label class="fmt-dialog__label">Thousands separator</label>
						<select
							class="fmt-dialog__select"
							value={thousandsSeparator()}
							onChange={(e) => setThousandsSeparator(e.currentTarget.value as ThousandsSeparator)}
						>
							<option value="">None</option>
							<option value=",">Comma (,)</option>
							<option value=".">Dot (.)</option>
							<option value=" ">Space</option>
						</select>
					</div>
					<div class="fmt-dialog__field fmt-dialog__field--inline">
						<label class="fmt-dialog__label">Decimal places</label>
						<input
							class="fmt-dialog__input fmt-dialog__input--short"
							type="number"
							min="-1"
							max="20"
							value={decimalPlaces()}
							onInput={(e) => setDecimalPlaces(Number(e.currentTarget.value))}
						/>
					</div>
					<div class="fmt-dialog__preview">
						Preview: {numberPreview()} <span style={{ color: "var(--ink-muted)", "font-size": "var(--font-size-xs)" }}>(-1 = as-is)</span>
					</div>
				</div>

				{/* NULL */}
				<div class="fmt-dialog__section">
					<h4 class="fmt-dialog__section-title">NULL Values</h4>
					<div class="fmt-dialog__field fmt-dialog__field--inline">
						<label class="fmt-dialog__label">Display text</label>
						<select
							class="fmt-dialog__select"
							value={nullDisplay()}
							onChange={(e) => setNullDisplay(e.currentTarget.value as NullDisplay)}
						>
							<option value="NULL">NULL</option>
							<option value="(empty)">(empty)</option>
							<option value={"\u2205"}>{"\u2205"} (empty set)</option>
						</select>
					</div>
				</div>

				{/* Boolean */}
				<div class="fmt-dialog__section">
					<h4 class="fmt-dialog__section-title">Boolean</h4>
					<div class="fmt-dialog__field fmt-dialog__field--inline">
						<label class="fmt-dialog__label">Display format</label>
						<select
							class="fmt-dialog__select"
							value={booleanDisplay()}
							onChange={(e) => setBooleanDisplay(e.currentTarget.value as BooleanDisplay)}
						>
							<option value="true/false">true / false</option>
							<option value="1/0">1 / 0</option>
							<option value="yes/no">yes / no</option>
							<option value={"\u2713/\u2717"}>{"\u2713 / \u2717"} (check/cross)</option>
						</select>
					</div>
				</div>

				{/* Binary */}
				<div class="fmt-dialog__section">
					<h4 class="fmt-dialog__section-title">Binary Data</h4>
					<div class="fmt-dialog__field fmt-dialog__field--inline">
						<label class="fmt-dialog__label">Display format</label>
						<select
							class="fmt-dialog__select"
							value={binaryDisplay()}
							onChange={(e) => setBinaryDisplay(e.currentTarget.value as BinaryDisplay)}
						>
							<option value="size">(binary N bytes)</option>
							<option value="hex">Hex</option>
							<option value="base64">Base64</option>
						</select>
					</div>
				</div>

				<div class="fmt-dialog__actions">
					<button class="btn btn--secondary" onClick={props.onClose}>Cancel</button>
					<button class="btn btn--primary" onClick={handleSave}>Save</button>
				</div>
			</div>
		</Dialog>
	);
}

function formatNumberPreview(num: number, decSep: string, thousSep: string, places: number): string {
	let str: string;
	if (places >= 0) {
		str = num.toFixed(places);
	} else {
		str = String(num);
	}

	const [intPart, fracPart] = str.split(".");

	let formattedInt = intPart;
	if (thousSep) {
		formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousSep);
	}

	if (fracPart !== undefined) {
		return formattedInt + decSep + fracPart;
	}
	return formattedInt;
}

function formatDatePreview(d: Date, format: DateFormat): string {
	const pad = (n: number) => String(n).padStart(2, "0");
	const Y = d.getFullYear();
	const M = pad(d.getMonth() + 1);
	const D = pad(d.getDate());
	const h = pad(d.getHours());
	const m = pad(d.getMinutes());
	const s = pad(d.getSeconds());

	switch (format) {
		case "YYYY-MM-DD HH:mm:ss":
			return `${Y}-${M}-${D} ${h}:${m}:${s}`;
		case "DD.MM.YYYY HH:mm:ss":
			return `${D}.${M}.${Y} ${h}:${m}:${s}`;
		case "MM/DD/YYYY HH:mm:ss":
			return `${M}/${D}/${Y} ${h}:${m}:${s}`;
		case "YYYY-MM-DD":
			return `${Y}-${M}-${D}`;
		case "ISO 8601":
			return d.toISOString();
	}
}
