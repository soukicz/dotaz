export interface AppCapabilities {
	/** Can read/write files via path (desktop) */
	hasFileSystem: boolean
	/** Can stream via HTTP endpoints (web) */
	hasHttpStreaming: boolean
	/** Has native open/save dialogs (desktop) */
	hasNativeDialogs: boolean
	/** Desktop app with custom title bar and window controls */
	isDesktop: boolean
	/** Running in demo mode (browser-only, no persistent state) */
	isDemo: boolean
}

const defaults: AppCapabilities = {
	hasFileSystem: false,
	hasHttpStreaming: false,
	hasNativeDialogs: false,
	isDesktop: false,
	isDemo: false,
}

let _capabilities: AppCapabilities = { ...defaults }

export function setCapabilities(c: Partial<AppCapabilities> & Omit<AppCapabilities, 'isDemo' | 'isDesktop'>): void {
	_capabilities = { ...defaults, ...c }
}

export function getCapabilities(): Readonly<AppCapabilities> {
	return _capabilities
}
