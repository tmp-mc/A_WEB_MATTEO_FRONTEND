<script lang="ts">
	import Sidebar from '$lib/Sidebar.svelte';
	import { t, SUPPORTED_LANGS } from '$lib/i18n';
	import { buildOrganizationJsonLd, DOMAIN } from '$lib/seo';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const tt = $derived(t(data.lang));

	const ogLocales: Record<string, string> = {
		it: 'it_CH',
		fr: 'fr_CH',
		de: 'de_CH'
	};

	const canonicalUrl = $derived(`${DOMAIN}${page.url.pathname}`);
	const ogLocale = $derived(ogLocales[data.lang] ?? 'it_CH');
	const jsonLd = $derived(buildOrganizationJsonLd(data.lang));
</script>

<svelte:head>
	<title>{tt.metaTitle}</title>
	<meta name="description" content={tt.metaDescription} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- hreflang: tell search engines about each language variant -->
	{#each SUPPORTED_LANGS as l (l)}
		<link rel="alternate" hreflang={l} href={`${DOMAIN}/${l}`} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={`${DOMAIN}/it`} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Matteo Snozzi Ingegnere" />
	<meta property="og:title" content={tt.metaTitle} />
	<meta property="og:description" content={tt.metaDescription} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={`${DOMAIN}/og-image.svg`} />
	<meta property="og:image:alt" content="Matteo Snozzi Ingegnere — Logo" />
	<meta property="og:locale" content={ogLocale} />

	<!-- Twitter / X Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={tt.metaTitle} />
	<meta name="twitter:description" content={tt.metaDescription} />
	<meta name="twitter:image" content={`${DOMAIN}/og-image.svg`} />

	<!-- JSON-LD Structured Data — XSS-safe: '<' is escaped to '\u003c' in seo.ts -->
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

<div class="layout">
	<aside class="sidebar">
		<Sidebar projects={data.projects} lang={data.lang} />
	</aside>
	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: var(--sidebar-width) 1fr;
		min-height: 100vh;
	}

	.sidebar {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow-y: auto;
		border-right: 1px solid var(--color-border);
		padding: var(--gap-lg);
	}

	.content {
		padding-top: 0;
	}

	/*
	 * Sticky 2px cover at the very top of the content column.
	 * As any project card scrolls up to y=0 its border-top slides
	 * behind this element and disappears — no JS needed.
	 */
	.content::before {
		content: '';
		display: block;
		position: sticky;
		top: 0;
		height: 2px;
		background: var(--color-bg);
		z-index: 2;
		margin-bottom: -2px;
	}

	/* ── Mobile ── */
	@media (max-width: 768px) {
		.layout {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
		}

		.sidebar {
			position: sticky;
			top: 0;
			height: auto;
			overflow-y: visible;
			border-right: none;
			border-bottom: 1px solid var(--color-border);
			z-index: 10;
			background: var(--color-bg);
			max-height: 100vh;
			overflow-y: auto;
		}

		.content {
			padding-top: 0;
		}
	}
</style>
