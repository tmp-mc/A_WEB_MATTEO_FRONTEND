import { writable } from 'svelte/store';

export interface ProjectTranslation {
	id?: number;
	languages_code: string;
	name: string;
	description: string | null;
}

export interface ProjectImage {
	directus_files_id: string;
	sort?: number | null;
}

export interface Project {
	id: number;
	sort: number | null;
	status: string;
	type: 'bando pubblico' | 'privato' | 'progetto' | string;
	year: number;
	partners: string[] | null;
	translations: ProjectTranslation[];
	images: ProjectImage[];
}

// Active project highlight (client-side state)
export const activeProject = writable<number | null>(null);
