/**
 * Shared SQL scanner that identifies code vs non-code regions.
 * Handles single-quoted strings, double-quoted identifiers,
 * dollar-quoted strings, line comments, and block comments.
 */

export interface SqlRegion {
	/** Start position (inclusive) */
	from: number
	/** End position (exclusive) */
	to: number
	type: 'line-comment' | 'block-comment' | 'dollar-quote' | 'single-quote' | 'double-quote'
}

/**
 * Scan SQL and return all non-code regions (strings, comments, quoted identifiers).
 * Code regions are everything NOT covered by the returned regions.
 */
export function scanSqlRegions(sql: string): SqlRegion[] {
	const regions: SqlRegion[] = []
	let i = 0

	while (i < sql.length) {
		const ch = sql[i]
		const next = i + 1 < sql.length ? sql[i + 1] : ''

		// Line comment: -- until end of line
		if (ch === '-' && next === '-') {
			const start = i
			const lineEnd = sql.indexOf('\n', i)
			i = lineEnd === -1 ? sql.length : lineEnd
			regions.push({ from: start, to: i, type: 'line-comment' })
			continue
		}

		// Block comment: /* ... */
		if (ch === '/' && next === '*') {
			const start = i
			const endIdx = sql.indexOf('*/', i + 2)
			i = endIdx === -1 ? sql.length : endIdx + 2
			regions.push({ from: start, to: i, type: 'block-comment' })
			continue
		}

		// Dollar-quoted string: $$...$$ or $tag$...$tag$
		if (ch === '$') {
			const tagMatch = sql.slice(i).match(/^(\$[a-zA-Z0-9_]*\$)/)
			if (tagMatch) {
				const tag = tagMatch[1]
				const start = i
				const endIdx = sql.indexOf(tag, i + tag.length)
				i = endIdx === -1 ? sql.length : endIdx + tag.length
				regions.push({ from: start, to: i, type: 'dollar-quote' })
				continue
			}
		}

		// Single-quoted string
		if (ch === "'") {
			const start = i
			i++
			while (i < sql.length) {
				if (sql[i] === "'") {
					i++
					if (i < sql.length && sql[i] === "'") {
						i++ // escaped ''
					} else {
						break
					}
				} else {
					i++
				}
			}
			regions.push({ from: start, to: i, type: 'single-quote' })
			continue
		}

		// Double-quoted identifier
		if (ch === '"') {
			const start = i
			i++
			while (i < sql.length) {
				if (sql[i] === '"') {
					i++
					if (i < sql.length && sql[i] === '"') {
						i++ // escaped ""
					} else {
						break
					}
				} else {
					i++
				}
			}
			regions.push({ from: start, to: i, type: 'double-quote' })
			continue
		}

		i++
	}

	return regions
}
