import type { RequestHandler } from '@sveltejs/kit';
import { SUPPORTED_LANGS } from '$lib/i18n';

const DOMAIN = 'https://progetta.ch';

export const GET: RequestHandler = () => {
	const hreflangs = SUPPORTED_LANGS.map(
		(l) => `\t\t<xhtml:link rel="alternate" hreflang="${l}" href="${DOMAIN}/${l}"/>`
	).join('\n');

	const urls = SUPPORTED_LANGS.map(
		(lang) => `\t<url>
\t\t<loc>${DOMAIN}/${lang}</loc>
\t\t<changefreq>weekly</changefreq>
\t\t<priority>${lang === 'it' ? '1.0' : '0.8'}</priority>
${hreflangs}
\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/it"/>
\t</url>`
	).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600, s-maxage=3600'
		}
	});
};
