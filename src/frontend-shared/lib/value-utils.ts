import { DatabaseDataType, isSqlDefault } from '../../shared/types/database'
import type { GridColumnDef } from '../../shared/types/grid'
import { isBooleanType, isNumericType } from './column-types'

export function valueToString(value: unknown, pretty?: boolean): string {
	if (value === null || value === undefined) return ''
	if (isSqlDefault(value)) return ''
	if (typeof value === 'object') return JSON.stringify(value, null, pretty ? 2 : undefined)
	return String(value)
}

export function parseValue(text: string, column: GridColumnDef): unknown {
	if (text === '') return column.nullable ? null : text
	if (isNumericType(column.dataType)) {
		const n = Number(text)
		return Number.isNaN(n) ? text : n
	}
	if (isBooleanType(column.dataType)) {
		const lower = text.toLowerCase()
		if (lower === 'true' || lower === '1' || lower === 't') return true
		if (lower === 'false' || lower === '0' || lower === 'f') return false
		return text
	}
	return text
}

export function dateInputValue(value: unknown, dataType: DatabaseDataType): string {
	if (value === null || value === undefined || isSqlDefault(value)) return ''
	const str = String(value)
	if (dataType === DatabaseDataType.Date) return str.substring(0, 10)
	const d = new Date(str)
	if (Number.isNaN(d.getTime())) return str
	return d.toISOString().substring(0, 19)
}
