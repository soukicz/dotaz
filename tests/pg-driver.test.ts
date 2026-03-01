/**
 * Tests for PostgresDriver — validates the DatabaseDriver interface
 * implementation for PostgreSQL using Bun.SQL.
 *
 * Requires docker-compose PG container:
 *   docker compose up -d
 *
 * Run: bun test tests/pg-driver.test.ts
 */
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from "bun:test";
import { PostgresDriver } from "../src/bun/db/postgres-driver";
import type { PostgresConnectionConfig } from "../src/shared/types/connection";
import { PG_URL, seedPostgres } from "./helpers";

const config: PostgresConnectionConfig = {
	type: "postgresql",
	host: "localhost",
	port: 5488,
	database: "dotaz_test",
	user: "dotaz",
	password: "dotaz",
};

let driver: PostgresDriver;

beforeAll(async () => {
	await seedPostgres();
});

beforeEach(async () => {
	driver = new PostgresDriver();
	await driver.connect(config);
});

afterEach(async () => {
	if (driver.isConnected()) {
		await driver.disconnect();
	}
});

describe("PostgresDriver lifecycle", () => {
	test("connect sets isConnected to true", () => {
		expect(driver.isConnected()).toBe(true);
	});

	test("disconnect sets isConnected to false", async () => {
		await driver.disconnect();
		expect(driver.isConnected()).toBe(false);
	});

	test("rejects non-postgresql config", async () => {
		const d = new PostgresDriver();
		await expect(
			d.connect({
				type: "sqlite",
				path: ":memory:",
			}),
		).rejects.toThrow("PostgresDriver requires a postgresql connection config");
	});

	test("throws when executing without connection", async () => {
		const d = new PostgresDriver();
		await expect(d.execute("SELECT 1")).rejects.toThrow("Not connected");
	});

	test("disconnect is idempotent", async () => {
		await driver.disconnect();
		await driver.disconnect(); // should not throw
		expect(driver.isConnected()).toBe(false);
	});
});

describe("PostgresDriver metadata", () => {
	test("getDriverType returns postgresql", () => {
		expect(driver.getDriverType()).toBe("postgresql");
	});

	test("quoteIdentifier wraps in double quotes", () => {
		expect(driver.quoteIdentifier("users")).toBe('"users"');
	});

	test("quoteIdentifier escapes internal double quotes", () => {
		expect(driver.quoteIdentifier('my"table')).toBe('"my""table"');
	});
});

describe("PostgresDriver execute", () => {
	test("SELECT returns rows with columns", async () => {
		const result = await driver.execute(
			"SELECT id, name, email FROM test_schema.users ORDER BY id",
		);
		expect(result.rowCount).toBe(3);
		expect(result.rows).toHaveLength(3);
		expect(result.columns).toHaveLength(3);
		expect(result.columns.map((c) => c.name)).toEqual([
			"id",
			"name",
			"email",
		]);
		expect(result.rows[0]).toMatchObject({
			id: 1,
			name: "Alice",
			email: "alice@example.com",
		});
		expect(result.durationMs).toBeGreaterThanOrEqual(0);
	});

	test("SELECT with params", async () => {
		const result = await driver.execute(
			"SELECT * FROM test_schema.users WHERE email = $1",
			["alice@example.com"],
		);
		expect(result.rowCount).toBe(1);
		expect(result.rows[0].name).toBe("Alice");
	});

	test("INSERT returns affectedRows", async () => {
		const result = await driver.execute(
			"INSERT INTO test_schema.users (name, email, age) VALUES ($1, $2, $3)",
			["Dave", "dave@example.com", 40],
		);
		expect(result.affectedRows).toBe(1);
		// cleanup
		await driver.execute(
			"DELETE FROM test_schema.users WHERE email = $1",
			["dave@example.com"],
		);
	});

	test("UPDATE returns affectedRows", async () => {
		await driver.beginTransaction();
		const result = await driver.execute(
			"UPDATE test_schema.users SET age = 99 WHERE age IS NOT NULL",
		);
		expect(result.affectedRows).toBe(2);
		await driver.rollback();
	});

	test("DELETE returns affectedRows", async () => {
		await driver.beginTransaction();
		const result = await driver.execute(
			"DELETE FROM test_schema.posts WHERE published = false",
		);
		expect(result.affectedRows).toBe(1);
		await driver.rollback();
	});

	test("empty SELECT returns empty columns and rows", async () => {
		const result = await driver.execute(
			"SELECT * FROM test_schema.users WHERE 1 = 0",
		);
		expect(result.rowCount).toBe(0);
		expect(result.rows).toEqual([]);
		expect(result.columns).toEqual([]);
	});

	test("NULL values are preserved", async () => {
		const result = await driver.execute(
			"SELECT age FROM test_schema.users WHERE name = 'Charlie'",
		);
		expect(result.rows[0].age).toBeNull();
	});

	test("throws on invalid SQL", async () => {
		await expect(
			driver.execute("SELECT * FROM nonexistent_table"),
		).rejects.toThrow();
	});

	test("JSONB values are returned", async () => {
		const result = await driver.execute(
			"SELECT metadata FROM test_schema.users WHERE name = 'Alice'",
		);
		expect(result.rows[0].metadata).toEqual({ role: "admin" });
	});

	test("timestamp values are returned", async () => {
		const result = await driver.execute(
			"SELECT created_at FROM test_schema.users WHERE name = 'Alice'",
		);
		expect(result.rows[0].created_at).toBeDefined();
	});
});

describe("PostgresDriver query cancellation", () => {
	test("cancel does not throw when no query is active", async () => {
		await expect(driver.cancel()).resolves.toBeUndefined();
	});
});

describe("PostgresDriver schema introspection", () => {
	test("getSchemas returns schemas excluding system schemas", async () => {
		const schemas = await driver.getSchemas();
		const names = schemas.map((s) => s.name);
		expect(names).toContain("public");
		expect(names).toContain("test_schema");
		expect(names).not.toContain("pg_catalog");
		expect(names).not.toContain("information_schema");
		expect(names).not.toContain("pg_toast");
	});

	test("getTables returns tables in schema", async () => {
		const tables = await driver.getTables("test_schema");
		const names = tables.map((t) => t.name);
		expect(names).toContain("users");
		expect(names).toContain("posts");
		expect(tables.every((t) => t.schema === "test_schema")).toBe(true);
		expect(tables.every((t) => t.type === "table")).toBe(true);
	});

	test("getTables includes views", async () => {
		await driver.execute(
			"CREATE OR REPLACE VIEW test_schema.active_users AS SELECT * FROM test_schema.users WHERE age IS NOT NULL",
		);
		const tables = await driver.getTables("test_schema");
		const view = tables.find((t) => t.name === "active_users");
		expect(view).toBeDefined();
		expect(view!.type).toBe("view");
		await driver.execute("DROP VIEW test_schema.active_users");
	});

	test("getColumns returns correct column info", async () => {
		const columns = await driver.getColumns("test_schema", "users");
		expect(columns.length).toBeGreaterThanOrEqual(5);

		const idCol = columns.find((c) => c.name === "id")!;
		expect(idCol.isPrimaryKey).toBe(true);
		expect(idCol.isAutoIncrement).toBe(true);
		expect(idCol.nullable).toBe(false);

		const nameCol = columns.find((c) => c.name === "name")!;
		expect(nameCol.dataType).toBe("text");
		expect(nameCol.isPrimaryKey).toBe(false);
		expect(nameCol.isAutoIncrement).toBe(false);
		expect(nameCol.nullable).toBe(false);

		const ageCol = columns.find((c) => c.name === "age")!;
		expect(ageCol.dataType).toBe("integer");
		expect(ageCol.nullable).toBe(true);

		const metadataCol = columns.find((c) => c.name === "metadata")!;
		expect(metadataCol.dataType).toBe("jsonb");
	});

	test("getColumns returns timestamptz type", async () => {
		const columns = await driver.getColumns("test_schema", "users");
		const createdCol = columns.find((c) => c.name === "created_at")!;
		expect(createdCol.dataType).toBe("timestamp with time zone");
	});

	test("getColumns detects serial as autoincrement", async () => {
		const columns = await driver.getColumns("test_schema", "users");
		const idCol = columns.find((c) => c.name === "id")!;
		expect(idCol.isAutoIncrement).toBe(true);
	});

	test("getIndexes returns indexes", async () => {
		const indexes = await driver.getIndexes("test_schema", "posts");
		const byName = indexes.find((i) => i.name === "idx_posts_user_id");
		expect(byName).toBeDefined();
		expect(byName!.columns).toEqual(["user_id"]);
		expect(byName!.isUnique).toBe(false);
		expect(byName!.isPrimary).toBe(false);
	});

	test("getIndexes detects unique indexes", async () => {
		const indexes = await driver.getIndexes("test_schema", "users");
		const uniqueIdx = indexes.find(
			(i) => i.isUnique && !i.isPrimary,
		);
		expect(uniqueIdx).toBeDefined();
		expect(uniqueIdx!.columns).toContain("email");
	});

	test("getIndexes detects primary key index", async () => {
		const indexes = await driver.getIndexes("test_schema", "users");
		const pkIdx = indexes.find((i) => i.isPrimary);
		expect(pkIdx).toBeDefined();
		expect(pkIdx!.columns).toContain("id");
		expect(pkIdx!.isUnique).toBe(true);
	});

	test("getForeignKeys returns FK info", async () => {
		const fks = await driver.getForeignKeys("test_schema", "posts");
		expect(fks).toHaveLength(1);
		expect(fks[0].columns).toEqual(["user_id"]);
		expect(fks[0].referencedTable).toBe("users");
		expect(fks[0].referencedColumns).toEqual(["id"]);
		expect(fks[0].referencedSchema).toBe("test_schema");
		expect(fks[0].onUpdate).toBe("NO ACTION");
		expect(fks[0].onDelete).toBe("NO ACTION");
	});

	test("getForeignKeys handles composite FKs", async () => {
		await driver.execute(`
			CREATE TABLE test_schema.ref_target (
				a INTEGER, b INTEGER, PRIMARY KEY (a, b)
			)
		`);
		await driver.execute(`
			CREATE TABLE test_schema.ref_source (
				x INTEGER, y INTEGER,
				FOREIGN KEY (x, y) REFERENCES test_schema.ref_target(a, b)
			)
		`);

		const fks = await driver.getForeignKeys("test_schema", "ref_source");
		expect(fks).toHaveLength(1);
		expect(fks[0].columns).toEqual(["x", "y"]);
		expect(fks[0].referencedColumns).toEqual(["a", "b"]);

		await driver.execute("DROP TABLE test_schema.ref_source");
		await driver.execute("DROP TABLE test_schema.ref_target");
	});

	test("getReferencingForeignKeys returns child tables", async () => {
		const refs = await driver.getReferencingForeignKeys("test_schema", "users");
		expect(refs).toHaveLength(1);
		expect(refs[0].referencingTable).toBe("posts");
		expect(refs[0].referencingColumns).toEqual(["user_id"]);
		expect(refs[0].referencedColumns).toEqual(["id"]);
		expect(refs[0].referencingSchema).toBe("test_schema");
	});

	test("getReferencingForeignKeys returns empty for unreferenced table", async () => {
		const refs = await driver.getReferencingForeignKeys("test_schema", "posts");
		expect(refs).toEqual([]);
	});

	test("getReferencingForeignKeys handles composite FKs", async () => {
		await driver.execute(`
			CREATE TABLE test_schema.ref_target_rev (
				a INTEGER, b INTEGER, PRIMARY KEY (a, b)
			)
		`);
		await driver.execute(`
			CREATE TABLE test_schema.ref_source_rev (
				x INTEGER, y INTEGER,
				FOREIGN KEY (x, y) REFERENCES test_schema.ref_target_rev(a, b)
			)
		`);

		const refs = await driver.getReferencingForeignKeys("test_schema", "ref_target_rev");
		expect(refs).toHaveLength(1);
		expect(refs[0].referencingTable).toBe("ref_source_rev");
		expect(refs[0].referencingColumns).toEqual(["x", "y"]);
		expect(refs[0].referencedColumns).toEqual(["a", "b"]);

		await driver.execute("DROP TABLE test_schema.ref_source_rev");
		await driver.execute("DROP TABLE test_schema.ref_target_rev");
	});

	test("getReferencingForeignKeys handles multiple child tables", async () => {
		await driver.execute(`
			CREATE TABLE test_schema.comments_rev (
				id SERIAL PRIMARY KEY,
				user_id INTEGER NOT NULL REFERENCES test_schema.users(id),
				body TEXT NOT NULL
			)
		`);

		const refs = await driver.getReferencingForeignKeys("test_schema", "users");
		expect(refs.length).toBe(2);
		const tableNames = refs.map((r) => r.referencingTable).sort();
		expect(tableNames).toEqual(["comments_rev", "posts"]);

		await driver.execute("DROP TABLE test_schema.comments_rev");
	});

	test("getPrimaryKey returns PK columns", async () => {
		const pk = await driver.getPrimaryKey("test_schema", "users");
		expect(pk).toEqual(["id"]);
	});

	test("getPrimaryKey handles composite PKs", async () => {
		await driver.execute(`
			CREATE TABLE test_schema.composite_pk (
				first_id INTEGER, second_id INTEGER,
				PRIMARY KEY (first_id, second_id)
			)
		`);
		const pk = await driver.getPrimaryKey("test_schema", "composite_pk");
		expect(pk).toEqual(["first_id", "second_id"]);
		await driver.execute("DROP TABLE test_schema.composite_pk");
	});

	test("getPrimaryKey returns empty for table without PK", async () => {
		await driver.execute(
			"CREATE TABLE test_schema.no_pk (a TEXT, b TEXT)",
		);
		const pk = await driver.getPrimaryKey("test_schema", "no_pk");
		expect(pk).toEqual([]);
		await driver.execute("DROP TABLE test_schema.no_pk");
	});
});

describe("PostgresDriver transactions", () => {
	test("inTransaction is false by default", () => {
		expect(driver.inTransaction()).toBe(false);
	});

	test("beginTransaction sets inTransaction", async () => {
		await driver.beginTransaction();
		expect(driver.inTransaction()).toBe(true);
		await driver.rollback();
	});

	test("commit clears inTransaction", async () => {
		await driver.beginTransaction();
		await driver.commit();
		expect(driver.inTransaction()).toBe(false);
	});

	test("rollback clears inTransaction", async () => {
		await driver.beginTransaction();
		await driver.rollback();
		expect(driver.inTransaction()).toBe(false);
	});

	test("commit persists changes", async () => {
		await driver.beginTransaction();
		await driver.execute(
			"INSERT INTO test_schema.users (name, email, age) VALUES ('TxUser', 'tx@example.com', 50)",
		);
		await driver.commit();

		const result = await driver.execute(
			"SELECT * FROM test_schema.users WHERE email = 'tx@example.com'",
		);
		expect(result.rowCount).toBe(1);

		// cleanup
		await driver.execute(
			"DELETE FROM test_schema.users WHERE email = 'tx@example.com'",
		);
	});

	test("rollback discards changes", async () => {
		await driver.beginTransaction();
		await driver.execute(
			"INSERT INTO test_schema.users (name, email, age) VALUES ('TxUser2', 'tx2@example.com', 50)",
		);
		await driver.rollback();

		const result = await driver.execute(
			"SELECT * FROM test_schema.users WHERE email = 'tx2@example.com'",
		);
		expect(result.rowCount).toBe(0);
	});
});
