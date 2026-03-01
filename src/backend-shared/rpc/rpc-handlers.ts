import type { ConnectionManager } from "../services/connection-manager";
import type { AppDatabase } from "../storage/app-db";
import type { EncryptionService } from "../services/encryption";
import { QueryExecutor } from "../services/query-executor";
import { BackendAdapter } from "./backend-adapter";
import { createHandlers as createSharedHandlers } from "./handlers";

export interface HandlerOptions {
	encryption?: EncryptionService;
}

export function createHandlers(cm: ConnectionManager, qe?: QueryExecutor, appDb?: AppDatabase, Utils?: typeof import("electrobun/bun").Utils, opts?: HandlerOptions) {
	if (!appDb) throw new Error("AppDatabase is required");
	const queryExecutor = qe ?? new QueryExecutor(cm, undefined, appDb);
	const adapter = new BackendAdapter(cm, queryExecutor, appDb, {
		encryption: opts?.encryption,
		Utils,
	});
	return createSharedHandlers(adapter);
}
