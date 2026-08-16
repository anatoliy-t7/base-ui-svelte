/** Site-wide SEO defaults for the docs app. */

export const SITE_NAME = 'base-ui-svelte';

export const SITE_TAGLINE = 'Unofficial Base UI port for Svelte 5';

export const DEFAULT_DESCRIPTION =
	'Unofficial Svelte 5 port of Base UI — unstyled, accessible compound components. Not affiliated with MUI or the Base UI team.';

export const GITHUB_URL = 'https://github.com/anatoliy-t7/base-ui-svelte';

export const NPM_URL = 'https://www.npmjs.com/package/base-ui-svelte';

/** Absolute path under `static/` used for Open Graph / Twitter cards. */
export const OG_IMAGE_PATH = '/logo.png';

export function formatPageTitle(pageTitle: string | undefined): string {
	const trimmed = pageTitle?.trim();
	if (!trimmed || trimmed === SITE_NAME) return SITE_NAME;
	return `${trimmed} · ${SITE_NAME}`;
}

export function resolveDescription(
	description: string | undefined,
	lead: string | undefined
): string {
	const value = (description ?? lead)?.trim();
	return value && value.length > 0 ? value : DEFAULT_DESCRIPTION;
}

export function absoluteUrl(origin: string, path: string): string {
	const base = origin.replace(/\/$/, '');
	if (path === '/' || path === '') return `${base}/`;
	return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Escape `<` so JSON-LD cannot break out of a `<script>` tag. */
export function stringifyJsonLd(value: unknown): string {
	return JSON.stringify(value).replaceAll('<', '\\u003c');
}