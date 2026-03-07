import { formatAll } from '../../shared/export/formatters'
import type { CsvDelimiter, ExportFormat } from '../../shared/types/export'

export function formatPreview(
	rows: Record<string, unknown>[] | null,
	columns: string[],
	format: ExportFormat,
	delimiter: CsvDelimiter,
	includeHeaders: boolean,
	batchSize: number,
	schema: string,
	table: string,
): string {
	if (!rows || rows.length === 0) return ''
	return formatAll(rows, columns, { format, schema, table, delimiter, includeHeaders, batchSize })
}
