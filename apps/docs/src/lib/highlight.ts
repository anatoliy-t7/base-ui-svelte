import { createHighlighter, type Highlighter } from 'shiki';
import { escapeSvelte } from 'mdsvex';

export const CODE_THEME = 'github-dark';

const langs = [
	'svelte',
	'typescript',
	'javascript',
	'tsx',
	'jsx',
	'bash',
	'shell',
	'shellscript',
	'css',
	'html',
	'json',
	'markdown',
	'diff',
	'plaintext',
	'text'
] as const;

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter(): Promise<Highlighter> {
	highlighterPromise ??= createHighlighter({
		themes: [CODE_THEME],
		langs: [...langs]
	});
	return highlighterPromise;
}

function resolveLang(lang: string | undefined): string {
	if (!lang || lang === 'text' || lang === 'plain') return 'plaintext';
	if (lang === 'sh' || lang === 'shell' || lang === 'zsh') return 'bash';
	if (lang === 'ts') return 'typescript';
	if (lang === 'js') return 'javascript';
	if (lang === 'md') return 'markdown';
	return lang;
}

/** Highlight source to HTML (inline theme colors). */
export async function highlightCode(code: string, lang?: string): Promise<string> {
	const highlighter = await getHighlighter();
	const resolved = resolveLang(lang);
	const loaded = highlighter.getLoadedLanguages();
	const safeLang = loaded.includes(resolved) ? resolved : 'plaintext';

	return highlighter.codeToHtml(code.trimEnd(), {
		lang: safeLang,
		theme: CODE_THEME
	});
}

/** mdsvex highlighter — returns `{@html ...}` for build-time fences. */
export async function mdsvexHighlighter(code: string, lang?: string | undefined): Promise<string> {
	const html = escapeSvelte(await highlightCode(code, lang));
	return `{@html \`${html}\`}`;
}
