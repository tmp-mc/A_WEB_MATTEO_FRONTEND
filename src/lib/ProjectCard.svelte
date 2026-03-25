<script lang="ts">
	interface Props {
		id: number;
		name: string;
		year: number;
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
		description,
		images = [],
		partners = null,
		active = false,
		priority = false
	}: Props = $props();

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
</script>

<article id="{id}-project" class:active>
	<div class="card-header">
		<span class="card-name">{name}</span>
		<span class="card-year">{year}</span>
	</div>

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
							<img
								src="{baseUrl}?width=1200&quality=80&format=webp"
								srcset={buildSrcset(baseUrl)}
								sizes="(max-width: 768px) 100vw, calc(100vw - var(--sidebar-width))"
								alt="{name} — image {i + 1}"
								width="1200"
								height="520"
								loading={priority && i === 0 ? 'eager' : 'lazy'}
								fetchpriority={priority && i === 0 ? 'high' : 'auto'}
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

	{#if partnersList.length > 0}
		<div class="partners">
			<span class="partners-label">Partnering with:</span>
			<span class="partners-list">{partnersList.join(', ')}</span>
		</div>
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

	.slide img {
		width: 100%;
		height: 520px;
		object-fit: cover;
		display: block;
		border: 4px solid var(--color-image-border);
	}

	/* ── Image placeholder ── */
	.image-placeholder {
		border: 4px solid var(--color-image-border);
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
		padding: 6px 16px 32px;
		font-size: var(--font-size-base);
		line-height: 1.65;
		max-width: 960px;
	}

	/* ── Partners ── */
	.partners {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 0 16px 24px;
		font-size: var(--font-size-base);
		text-transform: uppercase;
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
		.slide img,
		.image-placeholder {
			min-height: 280px;
		}

		.slide img {
			height: 280px;
		}

		.description {
			padding-bottom: 24px;
		}
	}
</style>
