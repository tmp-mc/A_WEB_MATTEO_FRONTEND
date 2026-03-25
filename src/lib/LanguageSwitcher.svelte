<script lang="ts">
	import type { Lang } from '$lib/i18n';
	import { SUPPORTED_LANGS } from '$lib/i18n';

	interface Props {
		current: Lang;
	}

	let { current }: Props = $props();

	const labels: Record<Lang, string> = {
		it: 'IT',
		fr: 'FR',
		de: 'DE'
	};
</script>

<div class="lang-switcher" aria-label="Language selection">
	{#each SUPPORTED_LANGS as lang}
		<a
			href="/{lang}"
			class="lang-btn"
			class:active={lang === current}
			aria-current={lang === current ? 'page' : undefined}
		>
			{labels[lang]}
		</a>
	{/each}
</div>

<style>
	.lang-switcher {
		display: flex;
		gap: 0;
		align-items: center;
	}

	.lang-btn {
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		text-transform: uppercase;
		text-decoration: none;
		padding: 2px 6px;
		border: 1px solid transparent;
		line-height: 1.5;
		letter-spacing: 0.05em;
	}

	.lang-btn:hover {
		border-color: var(--color-border);
	}

	.lang-btn.active {
		background: var(--color-text);
		color: var(--color-bg);
		border-color: var(--color-text);
	}
</style>
