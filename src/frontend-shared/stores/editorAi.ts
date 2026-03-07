import type { SetStoreFunction } from 'solid-js/store'
import { friendlyErrorMessage, rpc } from '../lib/rpc'
import type { EditorStoreState, TabEditorState } from './editor'

export function createEditorAiActions(
	setState: SetStoreFunction<EditorStoreState>,
	ensureTab: (tabId: string) => TabEditorState,
) {
	function openAiPrompt(tabId: string) {
		ensureTab(tabId)
		setState('tabs', tabId, { aiPromptOpen: true, aiError: null })
	}

	function closeAiPrompt(tabId: string) {
		ensureTab(tabId)
		setState('tabs', tabId, { aiPromptOpen: false, aiGenerating: false, aiError: null })
	}

	function toggleAiPrompt(tabId: string) {
		const tab = ensureTab(tabId)
		if (tab.aiPromptOpen) {
			closeAiPrompt(tabId)
		} else {
			openAiPrompt(tabId)
		}
	}

	async function generateAiSql(tabId: string, prompt: string) {
		const tab = ensureTab(tabId)
		if (!prompt.trim()) return

		setState('tabs', tabId, { aiGenerating: true, aiError: null })

		try {
			const result = await rpc.ai.generateSql({
				connectionId: tab.connectionId,
				database: tab.database,
				prompt: prompt.trim(),
			})

			// Insert generated SQL into editor
			const currentContent = tab.content
			if (currentContent.trim()) {
				// Append after existing content with a blank line separator
				setState('tabs', tabId, 'content', currentContent.trimEnd() + '\n\n' + result.sql)
			} else {
				setState('tabs', tabId, 'content', result.sql)
			}

			setState('tabs', tabId, { aiGenerating: false, aiPromptOpen: false, aiError: null })
		} catch (err) {
			const errorMessage = friendlyErrorMessage(err)
			setState('tabs', tabId, { aiGenerating: false, aiError: errorMessage })
		}
	}

	return { openAiPrompt, closeAiPrompt, toggleAiPrompt, generateAiSql }
}
