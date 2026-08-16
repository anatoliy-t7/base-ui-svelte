import { error } from '@sveltejs/kit';
import {
	getPageMarkdown,
	listMarkdownPrerenderEntries,
	markdownHeaders,
	markdownParamToPathname
} from '$lib/llms.js';
import type { EntryGenerator, RequestHandler } from './$types.js';

export const prerender = true;

export const entries: EntryGenerator = () => listMarkdownPrerenderEntries();

export const GET: RequestHandler = ({ params }) => {
	const pathname = markdownParamToPathname(params.md);
	const markdown = getPageMarkdown(pathname);
	if (!markdown) error(404, 'Not found');
	return new Response(markdown, { headers: markdownHeaders });
};
