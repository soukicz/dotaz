/**
 * Test helpers — shared utilities for Dotaz tests.
 */

/** PostgreSQL connection string for the test container (docker-compose.yml). */
export const PG_URL = process.env.PG_URL ?? "postgres://dotaz:dotaz@localhost:5488/dotaz_test";

/** Returns a temporary SQLite file path (in-memory or tmp). */
export function tmpSqlitePath(): string {
	return `:memory:`;
}

/**
 * Seed the test PostgreSQL database with a sample schema + data.
 * Idempotent — safe to call multiple times.
 */
export async function seedPostgres(url: string = PG_URL) {
	const { SQL } = await import("bun");
	const db = new SQL({ url });

	await db`DROP SCHEMA IF EXISTS test_schema CASCADE`;
	await db`CREATE SCHEMA test_schema`;

	await db`
		CREATE TABLE test_schema.users (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			age INTEGER,
			metadata JSONB DEFAULT '{}',
			created_at TIMESTAMPTZ NOT NULL DEFAULT now()
		)
	`;

	await db`
		CREATE TABLE test_schema.posts (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES test_schema.users(id),
			title TEXT NOT NULL,
			body TEXT,
			published BOOLEAN NOT NULL DEFAULT false,
			created_at TIMESTAMPTZ NOT NULL DEFAULT now()
		)
	`;

	await db`CREATE INDEX idx_posts_user_id ON test_schema.posts(user_id)`;

	await db`
		INSERT INTO test_schema.users (name, email, age, metadata) VALUES
		('Alice', 'alice@example.com', 30, '{"role": "admin"}'),
		('Bob', 'bob@example.com', 25, '{"role": "user"}'),
		('Charlie', 'charlie@example.com', NULL, '{}')
	`;

	await db`
		INSERT INTO test_schema.posts (user_id, title, body, published) VALUES
		(1, 'Hello World', 'First post content', true),
		(1, 'Draft Post', NULL, false),
		(2, 'Bobs Post', 'Some content here', true)
	`;

	await db.close();
}

/**
 * Seed a SQLite database with a sample schema + data.
 */
export async function seedSqlite(db: import("bun:sqlite").Database) {
	db.run(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			age INTEGER,
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		)
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL REFERENCES users(id),
			title TEXT NOT NULL,
			body TEXT,
			published INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		)
	`);

	db.run(`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`);

	db.run(`
		INSERT INTO users (name, email, age) VALUES
		('Alice', 'alice@example.com', 30),
		('Bob', 'bob@example.com', 25),
		('Charlie', 'charlie@example.com', NULL)
	`);

	db.run(`
		INSERT INTO posts (user_id, title, body, published) VALUES
		(1, 'Hello World', 'First post content', 1),
		(1, 'Draft Post', NULL, 0),
		(2, 'Bobs Post', 'Some content here', 1)
	`);
}
