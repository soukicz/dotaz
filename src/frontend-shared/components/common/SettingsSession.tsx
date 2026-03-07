import type { AutoPin, AutoUnpin, ConnectionMode } from '../../stores/session'
import Select from './Select'

export default function SettingsSession(props: {
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
