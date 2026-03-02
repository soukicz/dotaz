import { createStore } from "solid-js/store";
import type { FormatProfile } from "../../shared/types/settings";
import {
	DEFAULT_FORMAT_PROFILE,
	settingsToFormatProfile,
	formatProfileToSettings,
} from "../../shared/types/settings";
import { rpc } from "../lib/rpc";

interface SettingsState {
	formatProfile: FormatProfile;
	loaded: boolean;
}

const [state, setState] = createStore<SettingsState>({
	formatProfile: { ...DEFAULT_FORMAT_PROFILE },
	loaded: false,
});

async function loadSettings() {
	try {
		const all = await rpc.settings.getAll();
		setState("formatProfile", settingsToFormatProfile(all));
		setState("loaded", true);
	} catch {
		// Silently use defaults
		setState("loaded", true);
	}
}

async function saveFormatProfile(profile: FormatProfile) {
	setState("formatProfile", profile);
	const entries = formatProfileToSettings(profile);
	for (const [key, value] of Object.entries(entries)) {
		try {
			await rpc.settings.set({ key, value });
		} catch {
			console.debug("Failed to save setting", key);
		}
	}
}

export const settingsStore = {
	get formatProfile() {
		return state.formatProfile;
	},
	get loaded() {
		return state.loaded;
	},
	loadSettings,
	saveFormatProfile,
};
