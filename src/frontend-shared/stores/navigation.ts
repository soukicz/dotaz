import { createSignal } from "solid-js";
import { tabsStore } from "./tabs";
import { gridStore } from "./grid";

// ── Types ────────────────────────────────────────────────

interface NavigationEntry {
	tabId: string;
	fkDepth: number;
}

// ── State ────────────────────────────────────────────────

const MAX_ENTRIES = 50;

const backStack: NavigationEntry[] = [];
const forwardStack: NavigationEntry[] = [];
const [canGoBack, setCanGoBack] = createSignal(false);
const [canGoForward, setCanGoForward] = createSignal(false);

/** Suppresses recording during goBack/goForward execution. */
let navigating = false;

function updateSignals() {
	setCanGoBack(backStack.length > 0);
	setCanGoForward(forwardStack.length > 0);
}

function getCurrentEntry(): NavigationEntry | null {
	const tabId = tabsStore.activeTabId;
	if (!tabId) return null;
	const gridTab = gridStore.getTab(tabId);
	return {
		tabId,
		fkDepth: gridTab?.fkNavigationHistory.length ?? 0,
	};
}

function entriesMatch(a: NavigationEntry, b: NavigationEntry): boolean {
	return a.tabId === b.tabId && a.fkDepth === b.fkDepth;
}

function pushCurrent() {
	if (navigating) return;
	const entry = getCurrentEntry();
	if (!entry) return;

	// Deduplicate: skip if top of backStack matches
	if (backStack.length > 0 && entriesMatch(backStack[backStack.length - 1], entry)) {
		return;
	}

	backStack.push(entry);
	if (backStack.length > MAX_ENTRIES) {
		backStack.shift();
	}

	// Any new navigation clears the forward stack
	forwardStack.length = 0;
	updateSignals();
}

async function navigateToEntry(entry: NavigationEntry) {
	// Switch to the target tab if needed
	if (tabsStore.activeTabId !== entry.tabId) {
		tabsStore.setActiveTab(entry.tabId);
	}

	// Adjust FK depth
	const gridTab = gridStore.getTab(entry.tabId);
	if (gridTab) {
		const currentDepth = gridTab.fkNavigationHistory.length;
		if (entry.fkDepth < currentDepth) {
			// Need to go back in FK history
			const stepsBack = currentDepth - entry.fkDepth;
			for (let i = 0; i < stepsBack; i++) {
				await gridStore.navigateBack(entry.tabId);
			}
		}
		// Note: if entry.fkDepth > currentDepth, FK forward state is lost (by design)
	}
}

async function goBack() {
	if (backStack.length === 0) return;

	const current = getCurrentEntry();
	const target = backStack.pop()!;

	if (current) {
		forwardStack.push(current);
	}

	navigating = true;
	try {
		await navigateToEntry(target);
	} finally {
		navigating = false;
	}
	updateSignals();
}

async function goForward() {
	if (forwardStack.length === 0) return;

	const current = getCurrentEntry();
	const target = forwardStack.pop()!;

	if (current) {
		backStack.push(current);
		if (backStack.length > MAX_ENTRIES) {
			backStack.shift();
		}
	}

	navigating = true;
	try {
		await navigateToEntry(target);
	} finally {
		navigating = false;
	}
	updateSignals();
}

function handleTabClosed(tabId: string) {
	// Remove all entries referencing the closed tab
	for (let i = backStack.length - 1; i >= 0; i--) {
		if (backStack[i].tabId === tabId) backStack.splice(i, 1);
	}
	for (let i = forwardStack.length - 1; i >= 0; i--) {
		if (forwardStack[i].tabId === tabId) forwardStack.splice(i, 1);
	}
	updateSignals();
}

// ── Register callbacks ───────────────────────────────────

tabsStore.onBeforeTabChange(() => pushCurrent());
gridStore.onBeforeFkNavigation(() => pushCurrent());

// ── Export ────────────────────────────────────────────────

export const navigationStore = {
	get canGoBack() {
		return canGoBack();
	},
	get canGoForward() {
		return canGoForward();
	},
	goBack,
	goForward,
	handleTabClosed,
};
