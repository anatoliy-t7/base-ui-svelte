export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'docs-theme';

export function getSystemTheme(): ResolvedTheme {
	if (typeof window === 'undefined') return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
	return preference === 'system' ? getSystemTheme() : preference;
}

export function readStoredTheme(): ThemePreference {
	if (typeof localStorage === 'undefined') return 'system';
	const raw = localStorage.getItem(THEME_STORAGE_KEY);
	if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
	return 'system';
}

export function applyTheme(preference: ThemePreference): ResolvedTheme {
	const resolved = resolveTheme(preference);
	const root = document.documentElement;
	root.classList.toggle('dark', resolved === 'dark');
	root.dataset.theme = resolved;
	root.style.colorScheme = resolved;
	return resolved;
}
