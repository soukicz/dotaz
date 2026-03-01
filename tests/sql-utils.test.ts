import { describe, test, expect } from "bun:test";
import { getStatementAtCursor } from "../src/mainview/lib/sql-utils";

describe("getStatementAtCursor", () => {
	test("single statement, cursor at start", () => {
		expect(getStatementAtCursor("SELECT 1", 0)).toBe("SELECT 1");
	});

	test("single statement, cursor at end", () => {
		expect(getStatementAtCursor("SELECT 1", 8)).toBe("SELECT 1");
	});

	test("two statements, cursor in first", () => {
		expect(getStatementAtCursor("SELECT 1; SELECT 2", 3)).toBe("SELECT 1");
	});

	test("two statements, cursor in second", () => {
		expect(getStatementAtCursor("SELECT 1; SELECT 2", 12)).toBe("SELECT 2");
	});

	test("three statements, cursor in middle", () => {
		expect(getStatementAtCursor("SELECT 1; SELECT 2; SELECT 3", 14)).toBe("SELECT 2");
	});

	test("cursor right on semicolon goes to previous statement", () => {
		// Cursor at position 8 is at the semicolon itself — belongs to first statement
		expect(getStatementAtCursor("SELECT 1; SELECT 2", 8)).toBe("SELECT 1");
	});

	test("cursor right after semicolon goes to next statement", () => {
		expect(getStatementAtCursor("SELECT 1; SELECT 2", 9)).toBe("SELECT 2");
	});

	test("handles semicolons inside single-quoted strings", () => {
		const sql = "SELECT 'a;b'; SELECT 2";
		expect(getStatementAtCursor(sql, 0)).toBe("SELECT 'a;b'");
		expect(getStatementAtCursor(sql, 16)).toBe("SELECT 2");
	});

	test("handles semicolons inside double-quoted identifiers", () => {
		const sql = 'SELECT "a;b"; SELECT 2';
		expect(getStatementAtCursor(sql, 0)).toBe('SELECT "a;b"');
		expect(getStatementAtCursor(sql, 16)).toBe("SELECT 2");
	});

	test("handles semicolons inside line comments", () => {
		const sql = "SELECT 1 -- a; comment\n; SELECT 2";
		expect(getStatementAtCursor(sql, 0)).toBe("SELECT 1 -- a; comment");
		expect(getStatementAtCursor(sql, 30)).toBe("SELECT 2");
	});

	test("handles semicolons inside block comments", () => {
		const sql = "SELECT 1 /* a; b */; SELECT 2";
		expect(getStatementAtCursor(sql, 0)).toBe("SELECT 1 /* a; b */");
		expect(getStatementAtCursor(sql, 25)).toBe("SELECT 2");
	});

	test("handles dollar-quoted strings", () => {
		const sql = "SELECT $$a;b$$; SELECT 2";
		expect(getStatementAtCursor(sql, 0)).toBe("SELECT $$a;b$$");
		expect(getStatementAtCursor(sql, 20)).toBe("SELECT 2");
	});

	test("handles escaped quotes in single-quoted strings", () => {
		const sql = "SELECT 'a''b;c'; SELECT 2";
		expect(getStatementAtCursor(sql, 0)).toBe("SELECT 'a''b;c'");
		expect(getStatementAtCursor(sql, 20)).toBe("SELECT 2");
	});

	test("empty input returns empty string", () => {
		expect(getStatementAtCursor("", 0)).toBe("");
	});

	test("whitespace only returns empty string", () => {
		expect(getStatementAtCursor("   ;  ", 0)).toBe("");
	});

	test("trailing semicolon", () => {
		expect(getStatementAtCursor("SELECT 1;", 3)).toBe("SELECT 1");
	});
});
