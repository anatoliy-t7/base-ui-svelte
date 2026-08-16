import { absoluteUrl } from '$lib/seo.js';

export const prerender = true;

const BODY = `# Allow search engines and AI citation crawlers.
# Training-only bots (e.g. CCBot) are not blocked here; adjust if needed.
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /
`;

export function GET({ url }: { url: URL }): Response {
	const body = `${BODY}\nSitemap: ${absoluteUrl(url.origin, '/sitemap.xml')}\n`;
	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
}
