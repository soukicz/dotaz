export function formatNumber(n: number): string {
	return n.toLocaleString()
}

export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDisplayValue(value: unknown): string {
	if (value === null || value === undefined) return 'NULL'
	if (typeof value === 'object') return JSON.stringify(value)
	return String(value)
}
