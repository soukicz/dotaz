import type { ConnectionManager } from "./connection-manager";

/**
 * Manages transactions per-connection.
 * Wraps driver-level transaction methods with validation and state tracking.
 */
export class TransactionManager {
	private cm: ConnectionManager;

	constructor(cm: ConnectionManager) {
		this.cm = cm;
	}

	async begin(connectionId: string): Promise<void> {
		const driver = this.cm.getDriver(connectionId);
		if (driver.inTransaction()) {
			throw new Error("Transaction already active on this connection");
		}
		await driver.beginTransaction();
	}

	async commit(connectionId: string): Promise<void> {
		const driver = this.cm.getDriver(connectionId);
		if (!driver.inTransaction()) {
			throw new Error("No active transaction to commit");
		}
		await driver.commit();
	}

	async rollback(connectionId: string): Promise<void> {
		const driver = this.cm.getDriver(connectionId);
		if (!driver.inTransaction()) {
			throw new Error("No active transaction to rollback");
		}
		await driver.rollback();
	}

	isActive(connectionId: string): boolean {
		try {
			const driver = this.cm.getDriver(connectionId);
			return driver.inTransaction();
		} catch {
			return false;
		}
	}

	/** Rollback any active transaction on this connection (e.g. before disconnect). */
	async rollbackIfActive(connectionId: string): Promise<void> {
		if (this.isActive(connectionId)) {
			await this.rollback(connectionId);
		}
	}
}
