export type Lang = 'it' | 'fr' | 'de';

export const SUPPORTED_LANGS: Lang[] = ['it', 'fr', 'de'];
export const DEFAULT_LANG: Lang = 'it';

const translations: Record<Lang, Record<string, string>> = {
	it: {
		selectedWork: 'LAVORI SELEZIONATI',
		type: 'TIPO',
		year: 'ANNO',
		place: 'LUOGO',
		partnersWith: 'In collaborazione con',
		menu: 'MENU ≡',
		close: 'CHIUDI ✕',
		footerNote:
			"L'azienda garantisce che il tuo progetto è sicuro, sostenibile ed efficiente grazie all'aggiornamento continuo (FEM, BIM, AI), l'etica professionale e le competenze linguistiche (DE, FR, EN). Con noi le opere rispettano costi, tempi, ambiente e comunità, valorizzando le specificità di ogni progetto.",
		toggleNav: 'Apri navigazione',
		closeNav: 'Chiudi navigazione',
		// SEO
		metaTitle: 'Matteo Snozzi — Ingegnere Civile e Strutturale | Ticino',
		metaDescription:
			"Studio d'ingegneria civile e strutturale a Giubiasco. Progetti sicuri, sostenibili ed efficienti con competenze in FEM, BIM e AI. Rispettiamo costi, tempi e ambiente."
	},
	fr: {
		selectedWork: 'TRAVAUX SÉLECTIONNÉS',
		type: 'TYPE',
		year: 'ANNÉE',
		place: 'LIEU',
		partnersWith: 'En collaboration avec',
		menu: 'MENU ≡',
		close: 'FERMER ✕',
		footerNote:
			"L'entreprise garantit que votre projet est sûr, durable et efficace grâce à une mise à jour continue (FEM, BIM, IA), à l'éthique professionnelle et aux compétences linguistiques (DE, FR, EN). Avec nous, les ouvrages respectent les coûts, les délais, l'environnement et la communauté, en valorisant les spécificités de chaque projet.",
		toggleNav: 'Ouvrir la navigation',
		closeNav: 'Fermer la navigation',
		// SEO
		metaTitle: 'Matteo Snozzi — Ingénieur Civil et Structurel | Tessin',
		metaDescription:
			"Bureau d'ingénierie civile et structurelle à Giubiasco. Projets sûrs, durables et efficaces grâce aux compétences en FEM, BIM et IA. Respect des coûts, délais et environnement."
	},
	de: {
		selectedWork: 'AUSGEWÄHLTE ARBEITEN',
		type: 'TYP',
		year: 'JAHR',
		place: 'ORT',
		partnersWith: 'In Zusammenarbeit mit',
		menu: 'MENÜ ≡',
		close: 'SCHLIESSEN ✕',
		footerNote:
			'Das Unternehmen garantiert, dass Ihr Projekt sicher, nachhaltig und effizient ist, dank kontinuierlicher Weiterbildung (FEM, BIM, KI), professioneller Ethik und Sprachkenntnissen (DE, FR, EN). Bei uns respektieren die Bauwerke Kosten, Termine, Umwelt und Gemeinschaft und wahren die Besonderheiten jedes Projekts.',
		toggleNav: 'Navigation öffnen',
		closeNav: 'Navigation schließen',
		// SEO
		metaTitle: 'Matteo Snozzi — Bau- und Konstruktionsingenieur | Tessin',
		metaDescription:
			'Ingenieurbüro für Hoch- und Tiefbau in Giubiasco. Sichere, nachhaltige und effiziente Projekte dank FEM, BIM und KI. Einhaltung von Kosten, Terminen und Umweltstandards.'
	}
};

/** Full month names (index 0 = January) */
export const MONTH_NAMES: Record<Lang, string[]> = {
	it: [
		'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
		'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
	],
	fr: [
		'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
		'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
	],
	de: [
		'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
		'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
	]
};

/** Translated display labels for project types */
export const TYPE_LABELS: Record<Lang, Record<string, string>> = {
	it: { concorso: 'Concorso', progetto: 'Progetto' },
	fr: { concorso: 'Concours', progetto: 'Projet' },
	de: { concorso: 'Wettbewerb', progetto: 'Projekt' }
};

export function t(lang: Lang): Record<string, string> {
	return translations[lang] ?? translations.it;
}

export function isValidLang(lang: string): lang is Lang {
	return SUPPORTED_LANGS.includes(lang as Lang);
}

/** Format month (1-12) and year as e.g. "settembre 2025". Falls back to just year if month is absent. */
export function formatMonthYear(lang: Lang, month: number | null | undefined, year: number): string {
	if (!month || month < 1 || month > 12) return String(year);
	return `${MONTH_NAMES[lang][month - 1]} ${year}`;
}

/** Get translated label for a project type value. */
export function getTypeLabel(lang: Lang, type: string): string {
	return (TYPE_LABELS[lang] ?? TYPE_LABELS.it)[type] ?? type;
}
