<script lang="ts">
	interface Props {
		id: number;
		name: string;
		year: number;
		/** Pre-formatted "month year" string, e.g. "settembre 2025" */
		date?: string;
		/** Location where the project was built */
		place?: string | null;
		/** Translated project type label */
		type?: string | null;
		/** Chronological order number (1 = oldest). Displayed as zero-padded ID. */
		projectNumber?: number;
		/** Translated "Partnering with" label */
		partnersLabel?: string;
		description: string;
		images?: string[];
		partners?: string[] | null;
		active?: boolean;
		/** True for the first card — eager-loads LCP image */
		priority?: boolean;
	}

	let {
		id,
		name,
		year,
		date,
		place,
		type,
		projectNumber,
		partnersLabel = 'Partnering with',
		description,
		images = [],
		partners = null,
		active = false,
		priority = false
	}: Props = $props();

	/** Zero-pad a number to at least 2 digits: 1 → "01", 12 → "12" */
	function pad(n: number): string {
		return String(n).padStart(2, '0');
	}

	/**
	 * Build a Directus srcset from a base asset URL.
	 * Directus accepts ?width, ?quality and ?format as transform params.
	 */
	function buildSrcset(base: string): string {
		return [
			`${base}?width=480&quality=80&format=webp 480w`,
			`${base}?width=800&quality=80&format=webp 800w`,
			`${base}?width=1200&quality=80&format=webp 1200w`
		].join(', ');
	}

	// Normalise partners — Directus may return a JSON string instead of a parsed array
	const partnersList = $derived.by((): string[] => {
		if (!partners) return [];
		if (Array.isArray(partners)) return partners;
		try { return JSON.parse(partners as unknown as string) ?? []; } catch { return []; }
	});

	// Carousel state
	let currentSlide = $state(0);

	const totalSlides = $derived(images.length > 0 ? images.length : 3); // 3 placeholder slides if no images

	function prev() {
		currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
	}

	function next() {
		currentSlide = (currentSlide + 1) % totalSlides;
	}

	// ── Fullscreen lightbox (desktop only) ──
	let lightboxOpen = $state(false);
	let lightboxIndex = $state(0);
	let dialogEl = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialogEl) return;
		if (lightboxOpen) {
			dialogEl.showModal();
		} else if (dialogEl.open) {
			dialogEl.close();
		}
	});

	function openLightbox(i: number) {
		// Only open on desktop (>= 769px)
		if (typeof window !== 'undefined' && window.matchMedia('(min-width: 769px)').matches) {
			lightboxIndex = i;
			lightboxOpen = true;
		}
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function lightboxPrev(e: MouseEvent) {
		e.stopPropagation();
		lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
	}

	function lightboxNext(e: MouseEvent) {
		e.stopPropagation();
		lightboxIndex = (lightboxIndex + 1) % images.length;
	}

	function onDialogClick(e: MouseEvent) {
		// Close when clicking the backdrop (the dialog element itself, not its content)
		if (e.target === dialogEl) closeLightbox();
	}

	function onDialogClose() {
		lightboxOpen = false;
	}

	function onDialogKeydown(e: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (e.key === 'ArrowLeft') lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
		if (e.key === 'ArrowRight') lightboxIndex = (lightboxIndex + 1) % images.length;
	}
</script>

<article id="{id}-project" class:active>
	<div class="card-header">
		<span class="card-name">{name}</span>
		<span class="card-year">{year}{date ? ` — ${date}` : ''}</span>
	</div>

	<!-- Project location (place) shown below the title -->
	{#if place}
		<div class="card-meta">
			<span class="meta-item">{place}</span>
		</div>
	{/if}

	<!-- Carousel -->
	<div class="carousel-wrap">
		<div class="carousel">
			<div
				class="carousel-track"
				style="transform: translateX(-{currentSlide * 100}%)"
			>
				{#if images.length > 0}
					{#each images as baseUrl, i (i)}
						<div class="slide">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<img
								src="{baseUrl}?width=1200&quality=80&format=webp"
								srcset={buildSrcset(baseUrl)}
								sizes="(max-width: 768px) 100vw, calc(100vw - var(--sidebar-width))"
								alt="{name} — image {i + 1}"
								width="1200"
								height="520"
								loading={priority && i === 0 ? 'eager' : 'lazy'}
								fetchpriority={priority && i === 0 ? 'high' : 'auto'}
								class="carousel-img"
								onclick={() => openLightbox(i)}
							/>
						</div>
					{/each}
				{:else}
					<!-- Placeholder slides -->
					{#each Array(3) as _, i (i)}
						<div class="slide">
							<figure class="image-placeholder" aria-label="Placeholder image {i + 1}">
								<span class="image-caption">Cargo Rectangular Placeholder Image {i + 1} / 3</span>
							</figure>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Navigation -->
		{#if totalSlides > 1}
			<div class="carousel-nav">
				<button class="nav-btn" onclick={prev} aria-label="Previous image">&#8592;</button>
				<span class="slide-counter">{currentSlide + 1} / {totalSlides}</span>
				<button class="nav-btn" onclick={next} aria-label="Next image">&#8594;</button>
			</div>
		{/if}
	</div>

	{#if description}
		<p class="description">{@html description}</p>
	{/if}

	{#if type}
		<div class="partners">
			<span class="partners-label">ID:</span>
			<span class="partners-list">{type}{projectNumber !== undefined ? ` ${pad(projectNumber)}` : ''}</span>
		</div>
	{/if}

	{#if partnersList.length > 0}
		<div class="partners">
			<span class="partners-label">{partnersLabel}:</span>
			<span class="partners-list">{partnersList.join(', ')}</span>
		</div>
	{/if}

	<!-- Fullscreen lightbox — inside article so it doesn't sit between articles in flex container -->
	{#if images.length > 0}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<dialog
			bind:this={dialogEl}
			class="lightbox"
			onclick={onDialogClick}
			onclose={onDialogClose}
			onkeydown={onDialogKeydown}
			aria-label="Fullscreen image viewer"
		>
			<button class="lightbox-close" onclick={closeLightbox} aria-label="Close fullscreen">✕</button>

			{#if images.length > 1}
				<button class="lightbox-nav lightbox-prev" onclick={lightboxPrev} aria-label="Previous image">&#8592;</button>
			{/if}

			<img
				class="lightbox-img"
				src="{images[lightboxIndex]}?width=2400&quality=88&format=webp"
				alt="{name} — image {lightboxIndex + 1}"
			/>

			{#if images.length > 1}
				<button class="lightbox-nav lightbox-next" onclick={lightboxNext} aria-label="Next image">&#8594;</button>
				<span class="lightbox-counter">{lightboxIndex + 1} / {images.length}</span>
			{/if}
		</dialog>
	{/if}
</article>

<style>
	article {
		border-top: 2px solid var(--color-border);
	}

	.card-header {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 8px;
		padding: 4px 16px;
		font-family: var(--font-title);
		font-size: var(--font-size-base);
		font-weight: 700;
		text-transform: uppercase;
	}

	.card-year {
		text-align: right;
		white-space: nowrap;
	}

	/* ── Project meta bar ── */
	.card-meta {
		display: flex;
		flex-wrap: wrap;
		padding: 0 16px 6px;
		font-family: var(--font-body);
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		color: var(--color-muted);
		letter-spacing: 0.04em;
	}

	.meta-item {
		white-space: nowrap;
	}

	/* ── Carousel ── */
	.carousel-wrap {
		padding: 16px;
	}

	.carousel {
		overflow: hidden;
		position: relative;
	}

	.carousel-track {
		display: flex;
		transition: transform 0.3s ease;
		will-change: transform;
	}

	.slide {
		flex: 0 0 100%;
		min-width: 0;
	}

	.slide .carousel-img {
		width: 100%;
		height: 520px;
		object-fit: cover;
		display: block;
		border: 2px solid var(--color-image-border);
	}

	/* Show pointer cursor only on desktop to hint at click-to-zoom */
	@media (min-width: 769px) {
		.slide .carousel-img {
			cursor: zoom-in;
		}
	}

	/* ── Image placeholder ── */
	.image-placeholder {
		border: 2px solid var(--color-image-border);
		background-color: var(--color-image-bg);
		background-image: radial-gradient(circle, var(--color-image-dot) 1px, transparent 1px);
		background-size: 12px 12px;
		min-height: 520px;
		display: flex;
		align-items: flex-end;
		padding: 16px;
	}

	.image-caption {
		font-size: var(--font-size-sm);
		color: var(--color-muted);
		font-family: var(--font-mono);
	}

	/* ── Carousel nav ── */
	.carousel-nav {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-top: 8px;
	}

	.nav-btn {
		background: none;
		border: 1px solid var(--color-border);
		font-family: var(--font-mono);
		font-size: var(--font-size-base);
		cursor: pointer;
		padding: 2px 8px;
		line-height: 1.5;
		text-transform: uppercase;
	}

	.nav-btn:hover {
		background: var(--color-text);
		color: var(--color-bg);
	}

	.slide-counter {
		font-size: var(--font-size-sm);
		font-family: var(--font-mono);
		color: var(--color-muted);
		letter-spacing: 0.05em;
	}

	/* ── Text content ── */
	.description {
		padding: 6px 16px 12px;
		font-size: var(--font-size-base);
		line-height: 1.65;
		max-width: 960px;
	}

	/* ── Partners / ID ── */
	.partners {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 0 16px 8px;
		font-size: var(--font-size-base);
		text-transform: uppercase;
	}

	/* Last partners block gets a larger bottom margin to close out the card */
	.partners:last-of-type {
		padding-bottom: 20px;
	}

	.partners-label {
		font-family: var(--font-mono);
		color: var(--color-muted);
		white-space: nowrap;
	}

	.partners-list {
		font-weight: 700;
	}

	/* ── Mobile ── */
	@media (max-width: 768px) {
		.slide .carousel-img,
		.image-placeholder {
			min-height: 280px;
		}

		.slide .carousel-img {
			height: 280px;
		}

		.description {
			padding-bottom: 24px;
		}
	}

	/* ── Lightbox (desktop only) ── */
	.lightbox {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: rgba(0, 0, 0, 0.92);
		z-index: 1000;
	}

	/* Only apply flex layout when the dialog is actually open */
	.lightbox[open] {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Backdrop (clicking outside image closes) */
	.lightbox::backdrop {
		background: transparent;
	}

	.lightbox-img {
		max-width: calc(100vw - 160px);
		max-height: calc(100vh - 80px);
		width: auto;
		height: auto;
		object-fit: contain;
		display: block;
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.lightbox-close {
		position: fixed;
		top: 20px;
		right: 24px;
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.4);
		color: #fff;
		font-size: 16px;
		cursor: pointer;
		padding: 6px 12px;
		line-height: 1;
		font-family: var(--font-mono);
		z-index: 1001;
		outline: none;
		transition: background 0.15s ease;
	}

	.lightbox-close:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.lightbox-nav {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.4);
		color: #fff;
		font-size: 18px;
		cursor: pointer;
		padding: 12px 16px;
		line-height: 1;
		font-family: var(--font-mono);
		z-index: 1001;
		outline: none;
		transition: background 0.15s ease;
	}

	.lightbox-nav:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.lightbox-prev {
		left: 20px;
	}

	.lightbox-next {
		right: 20px;
	}

	.lightbox-counter {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.6);
		font-size: var(--font-size-sm);
		font-family: var(--font-mono);
		letter-spacing: 0.1em;
	}
</style>
