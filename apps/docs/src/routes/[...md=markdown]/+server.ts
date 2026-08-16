import { error } from '@sveltejs/kit';
import { getPageMarkdown, markdownHeaders, markdownParamToPathname } from '$lib/llms.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = ({ params }) => {
	const pathname = markdownParamToPathname(params.md);
	const markdown = getPageMarkdown(pathname);
	if (!markdown) error(404, 'Not found');
	return new Response(markdown, { headers: markdownHeaders });
};
