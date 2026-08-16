import { buildLlmsTxt, markdownHeaders } from '$lib/llms.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
	return new Response(buildLlmsTxt(url.origin), { headers: markdownHeaders });
};
