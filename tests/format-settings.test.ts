import { describe, test, expect } from "bun:test";
import {
	DEFAULT_FORMAT_PROFILE,
	formatProfileToSettings,
	settingsToFormatProfile,
} from "../src/shared/types/settings";
import type { FormatProfile } from "../src/shared/types/settings";

describe("formatProfileToSettings", () => {
	test("converts default profile to settings", () => {
		const settings = formatProfileToSettings(DEFAULT_FORMAT_PROFILE);
		expect(settings["format.dateFormat"]).toBe("YYYY-MM-DD HH:mm:ss");
		expect(settings["format.decimalSeparator"]).toBe(".");
		expect(settings["format.thousandsSeparator"]).toBe("");
		expect(settings["format.decimalPlaces"]).toBe("-1");
		expect(settings["format.nullDisplay"]).toBe("NULL");
		expect(settings["format.booleanDisplay"]).toBe("true/false");
		expect(settings["format.binaryDisplay"]).toBe("size");
	});

	test("converts custom profile to settings", () => {
		const profile: FormatProfile = {
			dateFormat: "DD.MM.YYYY HH:mm:ss",
			decimalSeparator: ",",
			thousandsSeparator: " ",
			decimalPlaces: 2,
			nullDisplay: "\u2205",
			booleanDisplay: "yes/no",
			binaryDisplay: "hex",
		};
		const settings = formatProfileToSettings(profile);
		expect(settings["format.dateFormat"]).toBe("DD.MM.YYYY HH:mm:ss");
		expect(settings["format.decimalSeparator"]).toBe(",");
		expect(settings["format.thousandsSeparator"]).toBe(" ");
		expect(settings["format.decimalPlaces"]).toBe("2");
		expect(settings["format.nullDisplay"]).toBe("\u2205");
		expect(settings["format.booleanDisplay"]).toBe("yes/no");
		expect(settings["format.binaryDisplay"]).toBe("hex");
	});
});

describe("settingsToFormatProfile", () => {
	test("returns defaults for empty settings", () => {
		const profile = settingsToFormatProfile({});
		expect(profile).toEqual(DEFAULT_FORMAT_PROFILE);
	});

	test("parses stored settings back into profile", () => {
		const original: FormatProfile = {
			dateFormat: "ISO 8601",
			decimalSeparator: ",",
			thousandsSeparator: ".",
			decimalPlaces: 3,
			nullDisplay: "(empty)",
			booleanDisplay: "1/0",
			binaryDisplay: "base64",
		};
		const settings = formatProfileToSettings(original);
		const restored = settingsToFormatProfile(settings);
		expect(restored).toEqual(original);
	});

	test("handles partial settings with defaults", () => {
		const settings: Record<string, string> = {
			"format.dateFormat": "DD.MM.YYYY HH:mm:ss",
			"format.nullDisplay": "\u2205",
		};
		const profile = settingsToFormatProfile(settings);
		expect(profile.dateFormat).toBe("DD.MM.YYYY HH:mm:ss");
		expect(profile.nullDisplay).toBe("\u2205");
		// Rest should be defaults
		expect(profile.decimalSeparator).toBe(".");
		expect(profile.thousandsSeparator).toBe("");
		expect(profile.decimalPlaces).toBe(-1);
		expect(profile.booleanDisplay).toBe("true/false");
		expect(profile.binaryDisplay).toBe("size");
	});

	test("round-trips all date formats", () => {
		const dateFormats = [
			"YYYY-MM-DD HH:mm:ss",
			"DD.MM.YYYY HH:mm:ss",
			"MM/DD/YYYY HH:mm:ss",
			"YYYY-MM-DD",
			"ISO 8601",
		] as const;

		for (const fmt of dateFormats) {
			const profile = { ...DEFAULT_FORMAT_PROFILE, dateFormat: fmt };
			const settings = formatProfileToSettings(profile);
			const restored = settingsToFormatProfile(settings);
			expect(restored.dateFormat).toBe(fmt);
		}
	});
});

describe("AppDatabase settings integration", () => {
	test("format settings stored and retrieved via AppDatabase", () => {
		const { AppDatabase } = require("../src/backend-shared/storage/app-db") as typeof import("../src/backend-shared/storage/app-db");
		const db = AppDatabase.create(":memory:");

		try {
			const profile: FormatProfile = {
				dateFormat: "DD.MM.YYYY HH:mm:ss",
				decimalSeparator: ",",
				thousandsSeparator: ".",
				decimalPlaces: 2,
				nullDisplay: "\u2205",
				booleanDisplay: "yes/no",
				binaryDisplay: "hex",
			};

			// Store format settings
			const settings = formatProfileToSettings(profile);
			for (const [key, value] of Object.entries(settings)) {
				db.setSetting(key, value);
			}

			// Retrieve and reconstruct
			const all = db.getAllSettings();
			const restored = settingsToFormatProfile(all);
			expect(restored).toEqual(profile);
		} finally {
			db.close();
		}
	});
});
