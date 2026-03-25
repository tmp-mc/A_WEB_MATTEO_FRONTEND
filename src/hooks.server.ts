import type { Handle } from '@sveltejs/kit';
import { isValidLang } from '$lib/i18n';

/**
 * Sets the <html lang="..."> attribute dynamically based on the [lang] route param.
 * Falls back to 'it' for the root redirect route (/ → /it).
 */
export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.params.lang;
	const htmlLang = lang && isValidLang(lang) ? lang : 'it';

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('lang="en"', `lang="${htmlLang}"`)
	});
};
