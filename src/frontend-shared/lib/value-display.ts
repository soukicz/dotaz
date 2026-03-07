import { isSqlDefault } from '../../shared/types/database'

/** Try to format a value as pretty-printed JSON. Returns null if not valid JSON. */
export function tryFormatJson(value: unknown): string | null {
	if (value === null || value === undefined) return null
	if (typeof value === 'object') {
		try {
			return JSON.stringify(value, null, 2)
		} catch {
			return null
		}
	}
	if (typeof value === 'string') {
		const trimmed = value.trim()
		if (
			(trimmed.startsWith('{') && trimmed.endsWith('}'))
			|| (trimmed.startsWith('[') && trimmed.endsWith(']'))
		) {
			try {
				const parsed = JSON.parse(trimmed)
				return JSON.stringify(parsed, null, 2)
			} catch {
				return null
			}
		}
	}
	return null
}

export function displayValue(value: unknown): string {
	if (value === null || value === undefined) return ''
	if (isSqlDefault(value)) return 'DEFAULT'
	if (typeof value === 'object') return JSON.stringify(value)
	return String(value)
}
