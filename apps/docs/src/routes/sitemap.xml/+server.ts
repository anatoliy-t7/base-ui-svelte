import { navSections } from '$lib/nav.js';
import { absoluteUrl, pageUrlPath } from '$lib/seo.js';

export const prerender = true;

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function collectPaths(): string[] {
	const paths = new Set<string>(['/']);
	for (const section of navSections) {
		for (const item of section.items) {
			if (item.external) continue;
			paths.add(pageUrlPath(item.href));
		}
	}
	return [...paths].sort((a, b) => a.localeCompare(b));
}

export function GET({ url }: { url: URL }): Response {
	const urls = collectPaths()
		.map((path) => {
			const loc = escapeXml(absoluteUrl(url.origin, path));
			return `\t<url>\n\t\t<loc>${loc}</loc>\n\t</url>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
}
