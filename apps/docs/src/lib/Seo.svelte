<script lang="ts">
	import { page } from '$app/state';
	import {
		DEFAULT_DESCRIPTION,
		GITHUB_URL,
		OG_IMAGE_PATH,
		SITE_NAME,
		SITE_TAGLINE,
		absoluteUrl,
		formatPageTitle,
		resolveDescription,
		stringifyJsonLd
	} from './seo.js';

	let {
		title,
		description,
		lead,
		type = 'website'
	}: {
		title?: string;
		description?: string;
		/** @deprecated Prefer `description`. */
		lead?: string;
		type?: 'website' | 'article';
	} = $props();

	const metaDescription = $derived(resolveDescription(description, lead));
	const canonical = $derived(absoluteUrl(page.url.origin, page.url.pathname));
	const ogImage = $derived(absoluteUrl(page.url.origin, OG_IMAGE_PATH));
	const isHome = $derived(page.url.pathname === '/');
	const pageTitle = $derived(isHome ? SITE_NAME : formatPageTitle(title));
	const ogType = $derived(isHome ? 'website' : type);

	const jsonLd = $derived.by(() => {
		const website = {
			'@type': 'WebSite',
			'@id': `${absoluteUrl(page.url.origin, '/')}#website`,
			name: SITE_NAME,
			description: DEFAULT_DESCRIPTION,
			url: absoluteUrl(page.url.origin, '/'),
			inLanguage: 'en'
		};

		const software = {
			'@type': 'SoftwareApplication',
			name: SITE_NAME,
			description: DEFAULT_DESCRIPTION,
			url: absoluteUrl(page.url.origin, '/'),
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Web',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			},
			codeRepository: GITHUB_URL,
			programmingLanguage: 'Svelte'
		};

		if (isHome) {
			return {
				'@context': 'https://schema.org',
				'@graph': [website, software]
			};
		}

		return {
			'@context': 'https://schema.org',
			'@graph': [
				website,
				{
					'@type': 'TechArticle',
					headline: title?.trim() || SITE_NAME,
					description: metaDescription,
					url: canonical,
					inLanguage: 'en',
					isPartOf: { '@id': `${absoluteUrl(page.url.origin, '/')}#website` },
					author: {
						'@type': 'Organization',
						name: SITE_NAME,
						url: GITHUB_URL
					},
					publisher: {
						'@type': 'Organization',
						name: SITE_NAME,
						url: GITHUB_URL,
						logo: {
							'@type': 'ImageObject',
							url: ogImage
						}
					},
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': canonical
					}
				}
			]
		};
	});

	const jsonLdScript = $derived(stringifyJsonLd(jsonLd));
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="application-name" content={SITE_NAME} />
	<meta name="author" content={SITE_NAME} />
	<meta name="robots" content="index,follow,max-image-preview:large" />
	<link rel="canonical" href={canonical} />
	<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content={ogType} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:alt" content={`${SITE_NAME} — ${SITE_TAGLINE}`} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={`${SITE_NAME} — ${SITE_TAGLINE}`} />

	{@html `<script type="application/ld+json">${jsonLdScript}</script>`}
</svelte:head>
