export default function SettingsGrid(props: {
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
