<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

	let { children } = $props();

	// Extract the origin for preconnect (e.g. https://cms.progetta.ch)
	const directusOrigin = new URL(PUBLIC_DIRECTUS_URL).origin;
</script>

<svelte:head>
	<link rel="preconnect" href={directusOrigin} />
	<link rel="dns-prefetch" href={directusOrigin} />
	<link rel="icon" href={favicon} />
	<title>Matteo Snozzi Ingegnere</title>
</svelte:head>

{@render children()}
