import { createEffect, createMemo, createSignal, Show } from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'
import type {
	AiProvider,
	BinaryDisplay,
	BooleanDisplay,
	ColorTheme,
	DateFormat,
	DecimalSeparator,
	FormatProfile,
	NullDisplay,
	ThousandsSeparator,
} from '../../../shared/types/settings'
import type { AutoPin, AutoUnpin, ConnectionMode } from '../../stores/session'
import { settingsStore } from '../../stores/settings'
import type { SessionConfig } from '../../stores/settings'
import Dialog from './Dialog'
import Select from './Select'
import './SettingsDialog.css'

export type SettingsSection = 'appearance' | 'data-format' | 'ai' | 'session' | 'grid'

interface SettingsDialogProps {
	open: boolean
	onClose: () => void
	initialSection?: SettingsSection
}

export default function SettingsDialog(props: SettingsDialogProps) {
	const [section, setSection] = createSignal<SettingsSection>('appearance')
	const [appearance, setAppearance] = createStore({ colorTheme: 'dark' as ColorTheme })
	const [dataFormat, setDataFormat] = createStore<FormatProfile>({
		dateFormat: 'YYYY-MM-DD HH:mm:ss',
		decimalSeparator: '.',
		thousandsSeparator: '',
		decimalPlaces: -1,
		nullDisplay: 'NULL',
		booleanDisplay: 'true/false',
		binaryDisplay: 'size',
	})
	const [ai, setAi] = createStore({ provider: 'anthropic' as AiProvider, apiKey: '', model: '', endpoint: '' })
	const [session, setSession] = createStore<SessionConfig>({ defaultConnectionMode: 'pool', autoPin: 'on-begin', autoUnpin: 'never' })
	const [grid, setGrid] = createStore({ autoCount: false })
	let savedTheme: ColorTheme = 'dark'

	// Load all values when dialog opens
	createEffect(() => {
		if (props.open) {
			setSection(props.initialSection ?? 'appearance')

			const app = settingsStore.appearanceConfig
			setAppearance(reconcile({ colorTheme: app.colorTheme }))
			savedTheme = app.colorTheme

			setDataFormat(reconcile({ ...unwrap(settingsStore.formatProfile) }))
			setAi(reconcile({ ...unwrap(settingsStore.aiConfig) }))
			setSession(reconcile({ ...unwrap(settingsStore.sessionConfig) }))
			setGrid(reconcile({ autoCount: settingsStore.gridConfig.autoCount }))
		}
	})

	const numberPreview = createMemo(() => {
		const num = 1234567.891
		return formatNumberPreview(num, dataFormat.decimalSeparator, dataFormat.thousandsSeparator, dataFormat.decimalPlaces)
	})

	const datePreview = createMemo(() => {
		const now = new Date(2026, 2, 2, 14, 30, 45)
		return formatDatePreview(now, dataFormat.dateFormat)
	})

	function defaultModel(): string {
		switch (ai.provider) {
			case 'anthropic':
				return 'claude-sonnet-4-20250514'
			case 'openai':
				return 'gpt-4o'
			case 'custom':
				return ''
		}
	}

	function handleCancel() {
		settingsStore.applyTheme(savedTheme)
		props.onClose()
	}

	function handleThemeChange(theme: ColorTheme) {
		setAppearance('colorTheme', theme)
		settingsStore.applyTheme(theme)
	}

	function handleSave() {
		settingsStore.saveAppearanceConfig({ colorTheme: appearance.colorTheme })
		settingsStore.saveFormatProfile({ ...unwrap(dataFormat) })
		settingsStore.saveAiConfig({ ...unwrap(ai) })
		settingsStore.saveSessionConfig({ ...unwrap(session) })
		settingsStore.saveGridConfig({ autoCount: grid.autoCount })
		props.onClose()
	}

	return (
		<Dialog open={props.open} title="Settings" onClose={handleCancel} class="settings-dialog">
			<div class="settings-layout">
				<nav class="settings-nav">
					<button
						class="settings-nav__item"
						classList={{ 'settings-nav__item--active': section() === 'appearance' }}
						onClick={() => setSection('appearance')}
					>
						Appearance
					</button>
					<button
						class="settings-nav__item"
						classList={{ 'settings-nav__item--active': section() === 'data-format' }}
						onClick={() => setSection('data-format')}
					>
						Data Format
					</button>
					<button
						class="settings-nav__item"
						classList={{ 'settings-nav__item--active': section() === 'ai' }}
						onClick={() => setSection('ai')}
					>
						AI
					</button>
					<button
						class="settings-nav__item"
						classList={{ 'settings-nav__item--active': section() === 'session' }}
						onClick={() => setSection('session')}
					>
						Session
					</button>
					<button
						class="settings-nav__item"
						classList={{ 'settings-nav__item--active': section() === 'grid' }}
						onClick={() => setSection('grid')}
					>
						Grid
					</button>
				</nav>

				<div class="settings-content">
					<Show when={section() === 'appearance'}>
						<AppearanceSection
							colorTheme={appearance.colorTheme}
							setColorTheme={handleThemeChange}
						/>
					</Show>
					<Show when={section() === 'data-format'}>
						<DataFormatSection
							dateFormat={dataFormat.dateFormat}
							setDateFormat={(v) => setDataFormat('dateFormat', v)}
							decimalSeparator={dataFormat.decimalSeparator}
							setDecimalSeparator={(v) => setDataFormat('decimalSeparator', v)}
							thousandsSeparator={dataFormat.thousandsSeparator}
							setThousandsSeparator={(v) => setDataFormat('thousandsSeparator', v)}
							decimalPlaces={dataFormat.decimalPlaces}
							setDecimalPlaces={(v) => setDataFormat('decimalPlaces', v)}
							nullDisplay={dataFormat.nullDisplay}
							setNullDisplay={(v) => setDataFormat('nullDisplay', v)}
							booleanDisplay={dataFormat.booleanDisplay}
							setBooleanDisplay={(v) => setDataFormat('booleanDisplay', v)}
							binaryDisplay={dataFormat.binaryDisplay}
							setBinaryDisplay={(v) => setDataFormat('binaryDisplay', v)}
							datePreview={datePreview()}
							numberPreview={numberPreview()}
						/>
					</Show>
					<Show when={section() === 'ai'}>
						<AiSection
							provider={ai.provider}
							setProvider={(p) => {
								setAi('provider', p)
								if (!ai.model) setAi('model', defaultModel())
							}}
							apiKey={ai.apiKey}
							setApiKey={(v) => setAi('apiKey', v)}
							model={ai.model}
							setModel={(v) => setAi('model', v)}
							endpoint={ai.endpoint}
							setEndpoint={(v) => setAi('endpoint', v)}
							defaultModel={defaultModel()}
						/>
					</Show>
					<Show when={section() === 'session'}>
						<SessionSection
							mode={session.defaultConnectionMode}
							setMode={(v) => setSession('defaultConnectionMode', v)}
							autoPin={session.autoPin}
							setAutoPin={(v) => setSession('autoPin', v)}
							autoUnpin={session.autoUnpin}
							setAutoUnpin={(v) => setSession('autoUnpin', v)}
						/>
					</Show>
					<Show when={section() === 'grid'}>
						<GridSection
							autoCount={grid.autoCount}
							setAutoCount={(v) => setGrid('autoCount', v)}
						/>
					</Show>
				</div>
			</div>

			<div class="settings-actions">
				<button class="btn btn--secondary" onClick={handleCancel}>Cancel</button>
				<button class="btn btn--primary" onClick={handleSave}>Save</button>
			</div>
		</Dialog>
	)
}

// ── Appearance Section ───────────────────────────────────

function AppearanceSection(props: {
	colorTheme: ColorTheme
	setColorTheme: (v: ColorTheme) => void
}) {
	return (
		<div class="settings-form">
			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Color Theme</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Theme</label>
					<Select
						class="settings-form__select"
						value={props.colorTheme}
						onChange={(v) => props.setColorTheme(v as ColorTheme)}
						options={[
							{ value: 'dark', label: 'Dark' },
							{ value: 'light', label: 'Light' },
							{ value: 'high-contrast', label: 'High Contrast' },
							{ value: 'nord', label: 'Nord' },
							{ value: 'solarized-dark', label: 'Solarized Dark' },
							{ value: 'monokai', label: 'Monokai' },
						]}
					/>
				</div>
			</div>
		</div>
	)
}

// ── Data Format Section ──────────────────────────────────

function DataFormatSection(props: {
	dateFormat: DateFormat
	setDateFormat: (v: DateFormat) => void
	decimalSeparator: DecimalSeparator
	setDecimalSeparator: (v: DecimalSeparator) => void
	thousandsSeparator: ThousandsSeparator
	setThousandsSeparator: (v: ThousandsSeparator) => void
	decimalPlaces: number
	setDecimalPlaces: (v: number) => void
	nullDisplay: NullDisplay
	setNullDisplay: (v: NullDisplay) => void
	booleanDisplay: BooleanDisplay
	setBooleanDisplay: (v: BooleanDisplay) => void
	binaryDisplay: BinaryDisplay
	setBinaryDisplay: (v: BinaryDisplay) => void
	datePreview: string
	numberPreview: string
}) {
	return (
		<div class="settings-form">
			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Date & Time</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Display format</label>
					<Select
						class="settings-form__select"
						value={props.dateFormat}
						onChange={(v) => props.setDateFormat(v as DateFormat)}
						options={[
							{ value: 'YYYY-MM-DD HH:mm:ss', label: 'YYYY-MM-DD HH:mm:ss' },
							{ value: 'DD.MM.YYYY HH:mm:ss', label: 'DD.MM.YYYY HH:mm:ss' },
							{ value: 'MM/DD/YYYY HH:mm:ss', label: 'MM/DD/YYYY HH:mm:ss' },
							{ value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (date only)' },
							{ value: 'ISO 8601', label: 'ISO 8601' },
						]}
					/>
				</div>
				<div class="settings-form__preview">Preview: {props.datePreview}</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Numbers</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Decimal separator</label>
					<Select
						class="settings-form__select"
						value={props.decimalSeparator}
						onChange={(v) => props.setDecimalSeparator(v as DecimalSeparator)}
						options={[
							{ value: '.', label: 'Dot (.)' },
							{ value: ',', label: 'Comma (,)' },
						]}
					/>
				</div>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Thousands separator</label>
					<Select
						class="settings-form__select"
						value={props.thousandsSeparator}
						onChange={(v) => props.setThousandsSeparator(v as ThousandsSeparator)}
						options={[
							{ value: '', label: 'None' },
							{ value: ',', label: 'Comma (,)' },
							{ value: '.', label: 'Dot (.)' },
							{ value: ' ', label: 'Space' },
						]}
					/>
				</div>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Decimal places</label>
					<input
						class="settings-form__input settings-form__input--short"
						type="number"
						min="-1"
						max="20"
						value={props.decimalPlaces}
						onInput={(e) => props.setDecimalPlaces(Number(e.currentTarget.value))}
					/>
				</div>
				<div class="settings-form__preview">
					Preview: {props.numberPreview} <span style={{ color: 'var(--ink-muted)', 'font-size': 'var(--font-size-xs)' }}>(-1 = as-is)</span>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">NULL Values</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Display text</label>
					<Select
						class="settings-form__select"
						value={props.nullDisplay}
						onChange={(v) => props.setNullDisplay(v as NullDisplay)}
						options={[
							{ value: 'NULL', label: 'NULL' },
							{ value: '(empty)', label: '(empty)' },
							{ value: '\u2205', label: '\u2205 (empty set)' },
						]}
					/>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Boolean</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Display format</label>
					<Select
						class="settings-form__select"
						value={props.booleanDisplay}
						onChange={(v) => props.setBooleanDisplay(v as BooleanDisplay)}
						options={[
							{ value: 'true/false', label: 'true / false' },
							{ value: '1/0', label: '1 / 0' },
							{ value: 'yes/no', label: 'yes / no' },
							{ value: '\u2713/\u2717', label: '\u2713 / \u2717 (check/cross)' },
						]}
					/>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Binary Data</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Display format</label>
					<Select
						class="settings-form__select"
						value={props.binaryDisplay}
						onChange={(v) => props.setBinaryDisplay(v as BinaryDisplay)}
						options={[
							{ value: 'size', label: '(binary N bytes)' },
							{ value: 'hex', label: 'Hex' },
							{ value: 'base64', label: 'Base64' },
						]}
					/>
				</div>
			</div>
		</div>
	)
}

// ── AI Section ───────────────────────────────────────────

function AiSection(props: {
	provider: AiProvider
	setProvider: (v: AiProvider) => void
	apiKey: string
	setApiKey: (v: string) => void
	model: string
	setModel: (v: string) => void
	endpoint: string
	setEndpoint: (v: string) => void
	defaultModel: string
}) {
	return (
		<div class="settings-form">
			<div class="settings-form__section">
				<h4 class="settings-form__section-title">LLM Provider</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Provider</label>
					<Select
						class="settings-form__select"
						value={props.provider}
						onChange={(v) => props.setProvider(v as AiProvider)}
						options={[
							{ value: 'anthropic', label: 'Anthropic (Claude)' },
							{ value: 'openai', label: 'OpenAI' },
							{ value: 'custom', label: 'Custom (OpenAI-compatible)' },
						]}
					/>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">API Key</h4>
				<div class="settings-form__field">
					<input
						class="settings-form__input"
						type="password"
						placeholder="Enter your API key..."
						value={props.apiKey}
						onInput={(e) => props.setApiKey(e.currentTarget.value)}
						autocomplete="off"
					/>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Model</h4>
				<div class="settings-form__field">
					<input
						class="settings-form__input"
						type="text"
						placeholder={props.defaultModel || 'model-name'}
						value={props.model}
						onInput={(e) => props.setModel(e.currentTarget.value)}
					/>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Custom Endpoint</h4>
				<div class="settings-form__field">
					<input
						class="settings-form__input"
						type="text"
						placeholder={props.provider === 'custom' ? 'https://your-api.example.com' : 'Leave empty for default'}
						value={props.endpoint}
						onInput={(e) => props.setEndpoint(e.currentTarget.value)}
					/>
				</div>
				<div class="settings-form__preview" style={{ 'font-size': '11px' }}>
					{props.provider === 'anthropic' && 'Default: https://api.anthropic.com'}
					{props.provider === 'openai' && 'Default: https://api.openai.com'}
					{props.provider === 'custom' && 'Required for custom providers'}
				</div>
			</div>
		</div>
	)
}

// ── Session Section ──────────────────────────────────────

function SessionSection(props: {
	mode: ConnectionMode
	setMode: (v: ConnectionMode) => void
	autoPin: AutoPin
	setAutoPin: (v: AutoPin) => void
	autoUnpin: AutoUnpin
	setAutoUnpin: (v: AutoUnpin) => void
}) {
	return (
		<div class="settings-form">
			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Default Connection Mode</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Mode for new tabs</label>
					<Select
						class="settings-form__select"
						value={props.mode}
						onChange={(v) => props.setMode(v as ConnectionMode)}
						options={[
							{ value: 'pool', label: 'Pool (shared connections)' },
							{ value: 'pinned-per-tab', label: 'Pinned per tab (dedicated session)' },
							{ value: 'single-session', label: 'Single session (all tabs share one)' },
						]}
					/>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Auto-Pin</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Auto-create session when</label>
					<Select
						class="settings-form__select"
						value={props.autoPin}
						onChange={(v) => props.setAutoPin(v as AutoPin)}
						options={[
							{ value: 'on-begin', label: 'BEGIN / START TRANSACTION' },
							{ value: 'on-set-session', label: 'BEGIN + SET / CREATE TEMP' },
							{ value: 'never', label: 'Never' },
						]}
					/>
				</div>
			</div>

			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Auto-Unpin</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Auto-destroy session after</label>
					<Select
						class="settings-form__select"
						value={props.autoUnpin}
						onChange={(v) => props.setAutoUnpin(v as AutoUnpin)}
						options={[
							{ value: 'on-commit', label: 'COMMIT / ROLLBACK' },
							{ value: 'never', label: 'Never (keep session)' },
						]}
					/>
				</div>
			</div>
		</div>
	)
}

// ── Grid Section ─────────────────────────────────────────

function GridSection(props: {
	autoCount: boolean
	setAutoCount: (v: boolean) => void
}) {
	return (
		<div class="settings-form">
			<div class="settings-form__section">
				<h4 class="settings-form__section-title">Row Count</h4>
				<div class="settings-form__field settings-form__field--inline">
					<label class="settings-form__label">Auto-count rows</label>
					<input
						type="checkbox"
						checked={props.autoCount}
						onChange={(e) => props.setAutoCount(e.currentTarget.checked)}
					/>
				</div>
				<div class="settings-form__preview">
					When enabled, COUNT queries run automatically on every data load. When disabled, click "Count rows" in the pagination bar to count on demand.
				</div>
			</div>
		</div>
	)
}

// ── Preview helpers ──────────────────────────────────────

function formatNumberPreview(num: number, decSep: string, thousSep: string, places: number): string {
	let str: string
	if (places >= 0) {
		str = num.toFixed(places)
	} else {
		str = String(num)
	}

	const [intPart, fracPart] = str.split('.')

	let formattedInt = intPart
	if (thousSep) {
		formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousSep)
	}

	if (fracPart !== undefined) {
		return formattedInt + decSep + fracPart
	}
	return formattedInt
}

function formatDatePreview(d: Date, format: DateFormat): string {
	const pad = (n: number) => String(n).padStart(2, '0')
	const Y = d.getFullYear()
	const M = pad(d.getMonth() + 1)
	const D = pad(d.getDate())
	const h = pad(d.getHours())
	const m = pad(d.getMinutes())
	const s = pad(d.getSeconds())

	switch (format) {
		case 'YYYY-MM-DD HH:mm:ss':
			return `${Y}-${M}-${D} ${h}:${m}:${s}`
		case 'DD.MM.YYYY HH:mm:ss':
			return `${D}.${M}.${Y} ${h}:${m}:${s}`
		case 'MM/DD/YYYY HH:mm:ss':
			return `${M}/${D}/${Y} ${h}:${m}:${s}`
		case 'YYYY-MM-DD':
			return `${Y}-${M}-${D}`
		case 'ISO 8601':
			return d.toISOString()
	}
}
