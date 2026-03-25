import { redirect } from '@sveltejs/kit';
import { isValidLang } from '$lib/i18n';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';
import type { LayoutServerLoad } from './$types';
import type { Project } from '$lib/store';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	const lang = params.lang;

	if (!isValidLang(lang)) {
		redirect(307, '/it');
	}

	const url = new URL(`${PUBLIC_DIRECTUS_URL}/items/projects`);
	url.searchParams.set(
		'fields',
		'id,sort,type,year,partners,translations.name,translations.description,translations.languages_code,images.directus_files_id,images.sort'
	);
	url.searchParams.set('filter[status][_eq]', 'published');
	url.searchParams.set('deep[translations][_filter][languages_code][_eq]', lang);
	url.searchParams.set('sort', '-sort');

	const res = await fetch(url.toString());

	if (!res.ok) {
		return { projects: [] as Project[], lang };
	}

	const { data } = await res.json();
	return { projects: (data ?? []) as Project[], lang };
};
