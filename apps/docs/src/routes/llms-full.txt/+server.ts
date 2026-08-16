import { buildLlmsFullTxt, markdownHeaders } from '$lib/llms.js';
import type { RequestHandler } from './$types.js';

export const prerender = true;

export const GET: RequestHandler = () => {
	return new Response(buildLlmsFullTxt(), { headers: markdownHeaders });
};
