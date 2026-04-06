<script lang="ts">
	import { PUBLIC_DIRECTUS_URL } from '$env/static/public';
	import ProjectCard from '$lib/ProjectCard.svelte';
	import { activeProject } from '$lib/store';
	import { MONTH_NAMES, getTypeLabel, t } from '$lib/i18n';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const ui = $derived(t(data.lang));
	const total = $derived(data.projects.length);

	// Helper: get the single translation for current lang (already filtered server-side)
	function getTrans(project: (typeof data.projects)[number]) {
		return project.translations[0] ?? { name: '', description: null };
	}

	// Helper: build base image URLs (without transform params — ProjectCard adds srcset)
	function getImages(project: (typeof data.projects)[number]): string[] {
		return (project.images ?? [])
			.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
			.map((img) => `${PUBLIC_DIRECTUS_URL}/assets/${img.directus_files_id}`);
	}

	// Initialise active project to the first one on mount
	$effect(() => {
		if ($activeProject === null && data.projects.length > 0) {
			activeProject.set(data.projects[0].id);
		}
	});
</script>

<div class="projects">
	{#each data.projects as project, index (project.id)}
		{@const trans = getTrans(project)}
		<!-- Projects are sorted newest-first; chronological number: oldest = 01, newest = total -->
		{@const projectNumber = total - index}
		<ProjectCard
			id={project.id}
			name={trans.name}
			year={project.year}
			date={project.month && project.month >= 1 && project.month <= 12 ? MONTH_NAMES[data.lang][project.month - 1] : undefined}
			place={project.place}
			type={getTypeLabel(data.lang, project.type)}
			{projectNumber}
			partnersLabel={ui.partnersWith}
			description={trans.description ?? ''}
			images={getImages(project)}
			partners={project.partners}
			active={$activeProject === project.id}
			priority={index === 0}
		/>
	{/each}
</div>

<style>
	.projects {
		display: flex;
		flex-direction: column;
	}

	.projects > :global(article:first-child) {
		border-top: none;
	}
</style>
