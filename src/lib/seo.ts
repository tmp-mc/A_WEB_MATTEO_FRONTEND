import type { Lang } from '$lib/i18n';
import { t } from '$lib/i18n';

export const DOMAIN = 'https://progetta.ch';

/**
 * Builds an XSS-safe JSON-LD string for the Organization schema.
 * '<' is escaped to '\u003c' so an injected '</script>' cannot break out of the tag.
 */
export function buildOrganizationJsonLd(lang: Lang): string {
	const tt = t(lang);

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: 'Matteo Snozzi Ingegnere',
		url: DOMAIN,
		logo: `${DOMAIN}/og-image.svg`,
		telephone: '+41778073470',
		email: 'info@matteoSnozzi.ch',
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Via Ronchetti 2A',
			addressLocality: 'Giubiasco',
			postalCode: '6512',
			addressCountry: 'CH'
		},
		description: tt.metaDescription,
		sameAs: ['https://www.matteoSnozzi.ch']
	};

	return JSON.stringify(schema).replace(/</g, '\\u003c');
}
