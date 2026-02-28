import type { DatabaseDriver } from "../db/driver";
import { PostgresDriver } from "../db/postgres-driver";
import { SqliteDriver } from "../db/sqlite-driver";
import type { AppDatabase } from "../storage/app-db";
import type {
	ConnectionConfig,
	ConnectionInfo,
	ConnectionState,
} from "../../shared/types/connection";

export interface StatusChangeEvent {
	connectionId: string;
	state: ConnectionState;
	error?: string;
}

export type StatusChangeListener = (event: StatusChangeEvent) => void;

// ── Health check / reconnect defaults ────────────────────────
const DEFAULTS = {
	healthCheckIntervalMs: 30_000,
	reconnectBaseDelayMs: 1_000,
	reconnectMaxDelayMs: 30_000,
	reconnectMaxAttempts: 5,
};

export interface ConnectionManagerOptions {
	healthCheckIntervalMs?: number;
	reconnectBaseDelayMs?: number;
	reconnectMaxDelayMs?: number;
	reconnectMaxAttempts?: number;
}

interface ReconnectState {
	attempt: number;
	timer: ReturnType<typeof setTimeout> | null;
	cancelled: boolean;
}

export class ConnectionManager {
	private drivers = new Map<string, DatabaseDriver>();
	private states = new Map<
		string,
		{ state: ConnectionState; error?: string }
	>();
	private listeners: StatusChangeListener[] = [];
	private appDb: AppDatabase;
	private opts: Required<ConnectionManagerOptions>;

	// Health check timers keyed by connectionId
	private healthTimers = new Map<string, ReturnType<typeof setInterval>>();
	// Active auto-reconnect state keyed by connectionId
	private reconnectStates = new Map<string, ReconnectState>();

	constructor(appDb: AppDatabase, opts?: ConnectionManagerOptions) {
		this.appDb = appDb;
		this.opts = { ...DEFAULTS, ...opts };
	}

	// ── Connection lifecycle ────────────────────────────────

	async connect(connectionId: string): Promise<void> {
		const connInfo = this.appDb.getConnectionById(connectionId);
		if (!connInfo) {
			throw new Error(`Connection not found: ${connectionId}`);
		}

		// Cancel any pending auto-reconnect
		this.cancelAutoReconnect(connectionId);

		// Disconnect existing driver if already active
		if (this.drivers.has(connectionId)) {
			await this.disconnectDriver(connectionId);
		}

		this.setConnectionState(connectionId, "connecting");

		try {
			validateConfig(connInfo.config);
			const driver = createDriver(connInfo.config);
			await driver.connect(connInfo.config);
			this.drivers.set(connectionId, driver);
			this.setConnectionState(connectionId, "connected");
			this.startHealthCheck(connectionId);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unknown connection error";
			this.setConnectionState(connectionId, "error", message);
			throw err;
		}
	}

	async disconnect(connectionId: string): Promise<void> {
		this.cancelAutoReconnect(connectionId);
		this.stopHealthCheck(connectionId);
		await this.gracefulDisconnect(connectionId);
		this.setConnectionState(connectionId, "disconnected");
	}

	async reconnect(connectionId: string): Promise<void> {
		this.cancelAutoReconnect(connectionId);
		this.stopHealthCheck(connectionId);
		if (this.drivers.has(connectionId)) {
			await this.gracefulDisconnect(connectionId);
		}
		await this.connect(connectionId);
	}

	// ── Active connection access ────────────────────────────

	getDriver(connectionId: string): DatabaseDriver {
		const driver = this.drivers.get(connectionId);
		if (!driver) {
			throw new Error(
				`No active connection for id: ${connectionId}`,
			);
		}
		return driver;
	}

	getConnectionState(connectionId: string): ConnectionState {
		return this.states.get(connectionId)?.state ?? "disconnected";
	}

	// ── CRUD delegation to AppDatabase ──────────────────────

	listConnections(): ConnectionInfo[] {
		const connections = this.appDb.listConnections();
		return connections.map((conn) => ({
			...conn,
			state: this.getConnectionState(conn.id),
			error: this.states.get(conn.id)?.error,
		}));
	}

	createConnection(params: {
		name: string;
		config: ConnectionConfig;
	}): ConnectionInfo {
		validateConfig(params.config);
		return this.appDb.createConnection(params);
	}

	updateConnection(params: {
		id: string;
		name: string;
		config: ConnectionConfig;
	}): ConnectionInfo {
		validateConfig(params.config);
		const updated = this.appDb.updateConnection(params);
		return {
			...updated,
			state: this.getConnectionState(params.id),
			error: this.states.get(params.id)?.error,
		};
	}

	async deleteConnection(id: string): Promise<void> {
		this.cancelAutoReconnect(id);
		this.stopHealthCheck(id);
		// Disconnect if active before deleting
		if (this.drivers.has(id)) {
			await this.disconnectDriver(id);
		}
		this.states.delete(id);
		this.appDb.deleteConnection(id);
	}

	async testConnection(
		config: ConnectionConfig,
	): Promise<{ success: boolean; error?: string }> {
		validateConfig(config);
		const driver = createDriver(config);
		try {
			await driver.connect(config);
			await driver.disconnect();
			return { success: true };
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unknown connection error";
			return { success: false, error: message };
		}
	}

	// ── Event system ────────────────────────────────────────

	onStatusChanged(listener: StatusChangeListener): () => void {
		this.listeners.push(listener);
		return () => {
			const idx = this.listeners.indexOf(listener);
			if (idx >= 0) this.listeners.splice(idx, 1);
		};
	}

	// ── Cleanup ─────────────────────────────────────────────

	async disconnectAll(): Promise<void> {
		// Cancel all pending auto-reconnects (may not have a driver entry)
		for (const id of [...this.reconnectStates.keys()]) {
			this.cancelAutoReconnect(id);
		}
		// Stop all health checks
		for (const id of [...this.healthTimers.keys()]) {
			this.stopHealthCheck(id);
		}
		// Disconnect all active drivers
		const ids = [...this.drivers.keys()];
		for (const id of ids) {
			await this.disconnect(id);
		}
	}

	// ── Health check ────────────────────────────────────────

	private startHealthCheck(connectionId: string): void {
		this.stopHealthCheck(connectionId);
		const timer = setInterval(() => {
			this.performHealthCheck(connectionId);
		}, this.opts.healthCheckIntervalMs);
		this.healthTimers.set(connectionId, timer);
	}

	private stopHealthCheck(connectionId: string): void {
		const timer = this.healthTimers.get(connectionId);
		if (timer) {
			clearInterval(timer);
			this.healthTimers.delete(connectionId);
		}
	}

	private async performHealthCheck(connectionId: string): Promise<void> {
		const driver = this.drivers.get(connectionId);
		if (!driver) return;

		try {
			await driver.execute("SELECT 1");
		} catch {
			// Connection lost — stop health checks and begin auto-reconnect
			this.stopHealthCheck(connectionId);
			this.drivers.delete(connectionId);
			this.setConnectionState(connectionId, "disconnected", "Connection lost");
			this.startAutoReconnect(connectionId);
		}
	}

	// ── Auto-reconnect with exponential backoff ─────────────

	private startAutoReconnect(connectionId: string): void {
		this.cancelAutoReconnect(connectionId);
		const rs: ReconnectState = { attempt: 0, timer: null, cancelled: false };
		this.reconnectStates.set(connectionId, rs);
		this.scheduleReconnectAttempt(connectionId, rs);
	}

	private cancelAutoReconnect(connectionId: string): void {
		const rs = this.reconnectStates.get(connectionId);
		if (rs) {
			rs.cancelled = true;
			if (rs.timer) clearTimeout(rs.timer);
			this.reconnectStates.delete(connectionId);
		}
	}

	private scheduleReconnectAttempt(connectionId: string, rs: ReconnectState): void {
		if (rs.cancelled) return;
		if (rs.attempt >= this.opts.reconnectMaxAttempts) {
			this.reconnectStates.delete(connectionId);
			this.setConnectionState(
				connectionId,
				"error",
				`Reconnect failed after ${this.opts.reconnectMaxAttempts} attempts`,
			);
			return;
		}

		const delay = Math.min(
			this.opts.reconnectBaseDelayMs * Math.pow(2, rs.attempt),
			this.opts.reconnectMaxDelayMs,
		);

		rs.timer = setTimeout(() => {
			if (rs.cancelled) return;
			this.attemptReconnect(connectionId, rs);
		}, delay);
	}

	private async attemptReconnect(connectionId: string, rs: ReconnectState): Promise<void> {
		if (rs.cancelled) return;

		const connInfo = this.appDb.getConnectionById(connectionId);
		if (!connInfo) {
			this.cancelAutoReconnect(connectionId);
			return;
		}

		rs.attempt++;
		this.setConnectionState(connectionId, "reconnecting");

		try {
			const driver = createDriver(connInfo.config);
			await driver.connect(connInfo.config);

			if (rs.cancelled) {
				// Was cancelled while we were connecting
				await driver.disconnect();
				return;
			}

			this.drivers.set(connectionId, driver);
			this.reconnectStates.delete(connectionId);
			this.setConnectionState(connectionId, "connected");
			this.startHealthCheck(connectionId);
		} catch {
			if (rs.cancelled) return;
			this.scheduleReconnectAttempt(connectionId, rs);
		}
	}

	// ── Graceful disconnect ─────────────────────────────────

	private async gracefulDisconnect(connectionId: string): Promise<void> {
		const driver = this.drivers.get(connectionId);
		if (!driver) return;

		try {
			// Rollback any open transaction
			if (driver.inTransaction()) {
				try {
					await driver.rollback();
				} catch {
					// Best-effort rollback
				}
			}

			// Cancel any running query
			try {
				await driver.cancel();
			} catch {
				// Best-effort cancel
			}
		} finally {
			try {
				await driver.disconnect();
			} finally {
				this.drivers.delete(connectionId);
			}
		}
	}

	// ── Private helpers ─────────────────────────────────────

	private async disconnectDriver(connectionId: string): Promise<void> {
		const driver = this.drivers.get(connectionId);
		if (driver) {
			try {
				await driver.disconnect();
			} finally {
				this.drivers.delete(connectionId);
			}
		}
	}

	private setConnectionState(
		connectionId: string,
		state: ConnectionState,
		error?: string,
	): void {
		this.states.set(connectionId, { state, error });
		for (const listener of this.listeners) {
			listener({ connectionId, state, error });
		}
	}
}

// ── Factory helpers ─────────────────────────────────────────

function createDriver(config: ConnectionConfig): DatabaseDriver {
	switch (config.type) {
		case "postgresql":
			return new PostgresDriver();
		case "sqlite":
			return new SqliteDriver();
		default:
			throw new Error(
				`Unsupported connection type: ${(config as any).type}`,
			);
	}
}

function validateConfig(config: ConnectionConfig): void {
	if (!config || !config.type) {
		throw new Error("Connection config must have a type");
	}

	switch (config.type) {
		case "postgresql": {
			if (!config.host) throw new Error("PostgreSQL host is required");
			if (!config.port) throw new Error("PostgreSQL port is required");
			if (!config.database)
				throw new Error("PostgreSQL database is required");
			if (!config.user) throw new Error("PostgreSQL user is required");
			if (config.password === undefined || config.password === null)
				throw new Error("PostgreSQL password is required");
			break;
		}
		case "sqlite": {
			if (!config.path) throw new Error("SQLite path is required");
			break;
		}
		default:
			throw new Error(
				`Unsupported connection type: ${(config as any).type}`,
			);
	}
}
