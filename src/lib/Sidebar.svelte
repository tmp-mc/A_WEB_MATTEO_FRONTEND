<script lang="ts">
	import { activeProject } from './store';
	import { t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/LanguageSwitcher.svelte';
	import logoSrc from '$lib/assets/logo/Logo MS.svg';
	import type { Project } from './store';
	import type { Lang } from '$lib/i18n';

	interface Props {
		projects: Project[];
		lang: Lang;
	}

	let { projects, lang }: Props = $props();

	const ui = $derived(t(lang));

	// Mobile collapsible state
	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function selectProject(id: number) {
		activeProject.set(id);
		// On mobile, close the menu after selecting
		isOpen = false;
	}
</script>

<div class="sidebar-inner">
	<!-- Always-visible header: logo + mobile toggle -->
	<div class="sidebar-header">
		<a href="/" class="logo-link" aria-label="Matteo Snozzi Ingegnere">
			<img src={logoSrc} alt="Matteo Snozzi Ingegnere" class="logo" width="80" height="80" />
		</a>
		<div class="header-right">
			<button
				class="menu-toggle"
				onclick={toggleMenu}
				aria-expanded={isOpen}
				aria-label={isOpen ? ui.closeNav : ui.toggleNav}
			>
				{isOpen ? ui.close : ui.menu}
			</button>
		</div>
	</div>

	<!-- Collapsible body (always visible on desktop, toggled on mobile) -->
	<div class="sidebar-body" class:open={isOpen}>
		<div class="contact">
			<p>MATTEO SNOZZI INGEGNERE</p>
			<p>VIA RONCHETTI 2A — 6512 GIUBIASCO</p>
			<p>+41 77 807 34 70</p>
			<div class="contact-web">
				<p>
					<a href="mailto:info@matteoSnozzi.ch">INFO@MATTEOSNOZZI.CH</a>
				</p>
				<a
					href="https://ch.linkedin.com/in/matteo-snozzi-22711137a"
					target="_blank"
					rel="noopener noreferrer"
					class="linkedin-link"
					aria-label="LinkedIn"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
					</svg>
				</a>
			</div>
		</div>

		<hr />

		<div class="works">
			<div class="works-header">
				<span>{ui.selectedWork}</span>
				<span>{ui.type}</span>
				<span>{ui.year}</span>
			</div>

			{#each projects as project (project.id)}
				{@const trans = project.translations[0]}
				<div class="work-entry" class:active={project.id === $activeProject}>
					<div class="work-divider">
						<hr />
					</div>
					<a
						href="#{project.id}-project"
						class="work-row"
						onclick={() => selectProject(project.id)}
					>
						<span class="w-name">{trans?.name ?? '—'}</span>
						<span class="w-type">{project.type}</span>
						<span class="w-year">{project.year}</span>
					</a>
				</div>
			{/each}

			<hr />
		</div>

		<div class="footer">
			<p>{ui.footerNote}</p>
			<div class="footer-bottom">
				<LanguageSwitcher current={lang} />
			</div>
		</div>
	</div>
</div>

<style>
	.sidebar-inner {
		display: flex;
		flex-direction: column;
		gap: var(--gap-lg);
	}

	/* ── Always-visible header ── */
	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--gap-md);
	}

	.logo-link {
		display: inline-flex;
		align-items: center;
		line-height: 1;
	}

	.logo {
		width: clamp(60px, 8vw, 80px);
		height: auto;
		display: block;
	}

	/* Hide toggle on desktop */
	.menu-toggle {
		display: none;
	}

	/* ── Sidebar body ── */
	.sidebar-body {
		display: flex;
		flex-direction: column;
		gap: var(--gap-lg);
	}

	.contact {
		font-family: var(--font-body);
		font-size: var(--font-size-base);
		line-height: 1.65;
		text-transform: uppercase;
	}

	.contact a {
		text-decoration: underline;
	}

	.contact-web {
		display: flex;
		align-items: center;
		gap: var(--gap-sm);
		margin-top: 2px;
	}

	.contact-web p {
		margin: 0;
		flex: 1;
	}

	/* ── Works table ── */
	.works {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.works-header {
		display: grid;
		grid-template-columns: 1fr 70px 38px;
		font-family: var(--font-title);
		font-size: var(--font-size-base);
		font-weight: 700;
		text-transform: uppercase;
		padding-bottom: 2px;
	}

	.works-header span:last-child {
		text-align: right;
	}

	.work-entry {
		position: relative;
	}

	.work-divider {
		display: flex;
		align-items: flex-end;
	}

	.work-divider hr {
		flex: 1;
	}

	.work-row {
		display: grid;
		grid-template-columns: 1fr 70px 38px;
		text-decoration: none;
		padding: 1px 0 3px 0;
		font-family: var(--font-body);
		font-size: var(--font-size-base);
		text-transform: uppercase;
		cursor: pointer;
	}

	.w-year {
		text-align: right;
	}

	.work-row:hover .w-name {
		text-decoration: underline;
	}

	.work-entry.active .work-row {
		color: var(--color-accent);
	}

	/* ── Footer ── */
	.footer {
		font-family: var(--font-body);
		font-size: var(--font-size-base);
		line-height: 1.65;
	}

	.footer-bottom {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--gap-sm);
		margin-top: var(--gap-md);
	}

	.linkedin-link {
		display: flex;
		align-items: center;
		opacity: 0.5;
		transition: opacity 0.15s ease;
		color: var(--color-text);
	}

	.linkedin-link:hover {
		opacity: 1;
	}

	/* ── Mobile ── */
	@media (max-width: 768px) {
		.menu-toggle {
			display: block;
			background: none;
			border: 1px solid var(--color-border);
			font-family: var(--font-body);
			font-size: var(--font-size-base);
			text-transform: uppercase;
			padding: 4px 8px;
			cursor: pointer;
			letter-spacing: 0.05em;
		}

		.menu-toggle:hover,
		.menu-toggle[aria-expanded='true'] {
			background: var(--color-text);
			color: var(--color-bg);
		}

		/* Collapsed by default on mobile */
		.sidebar-body {
			display: none;
		}

		.sidebar-body.open {
			display: flex;
		}
	}
</style>
