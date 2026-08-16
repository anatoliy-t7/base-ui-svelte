<script lang="ts">
	import { page } from '$app/state';
	import { HOME_FAQS } from './home-seo.js';
	import {
		GITHUB_URL,
		HOME_DESCRIPTION,
		HOME_DOCUMENT_TITLE,
		NPM_URL,
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

	const isHome = $derived(page.url.pathname === '/');
	const metaDescription = $derived(
		isHome
			? resolveDescription(description, HOME_DESCRIPTION)
			: resolveDescription(description, lead)
	);
	const canonical = $derived(absoluteUrl(page.url.origin, page.url.pathname));
	const ogImage = $derived(absoluteUrl(page.url.origin, OG_IMAGE_PATH));
	const pageTitle = $derived(isHome ? HOME_DOCUMENT_TITLE : formatPageTitle(title));
	const ogType = $derived(isHome ? 'website' : type);

	const jsonLd = $derived.by(() => {
		const origin = page.url.origin;
		const homeUrl = absoluteUrl(origin, '/');
		const websiteId = `${homeUrl}#website`;
		const orgId = `${homeUrl}#organization`;
		const softwareId = `${homeUrl}#software`;

		const organization = {
			'@type': 'Organization',
			'@id': orgId,
			name: SITE_NAME,
			url: homeUrl,
			sameAs: [GITHUB_URL, NPM_URL],
			logo: {
				'@type': 'ImageObject',
				url: ogImage
			}
		};

		const website = {
			'@type': 'WebSite',
			'@id': websiteId,
			name: SITE_NAME,
			alternateName: SITE_TAGLINE,
			description: HOME_DESCRIPTION,
			url: homeUrl,
			inLanguage: 'en',
			publisher: { '@id': orgId }
		};

		const software = {
			'@type': 'SoftwareApplication',
			'@id': softwareId,
			name: SITE_NAME,
			alternateName: 'Base UI Svelte',
			description: HOME_DESCRIPTION,
			url: homeUrl,
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Web',
			license: 'https://opensource.org/licenses/MIT',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			},
			codeRepository: GITHUB_URL,
			downloadUrl: NPM_URL,
			programmingLanguage: ['Svelte', 'TypeScript'],
			author: { '@id': orgId },
			publisher: { '@id': orgId },
			sameAs: [GITHUB_URL, NPM_URL]
		};

		if (isHome) {
			const faqPage = {
				'@type': 'FAQPage',
				'@id': `${homeUrl}#faq`,
				url: homeUrl,
				mainEntity: HOME_FAQS.map((item) => ({
					'@type': 'Question',
					name: item.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: item.answer
					}
				}))
			};

			const webPage = {
				'@type': 'WebPage',
				'@id': `${homeUrl}#webpage`,
				url: homeUrl,
				name: HOME_DOCUMENT_TITLE,
				description: metaDescription,
				isPartOf: { '@id': websiteId },
				about: { '@id': softwareId },
				primaryImageOfPage: {
					'@type': 'ImageObject',
					url: ogImage
				},
				inLanguage: 'en'
			};

			return {
				'@context': 'https://schema.org',
				'@graph': [organization, website, software, webPage, faqPage]
			};
		}

		return {
			'@context': 'https://schema.org',
			'@graph': [
				organization,
				website,
				{
					'@type': 'TechArticle',
					headline: title?.trim() || SITE_NAME,
					description: metaDescription,
					url: canonical,
					inLanguage: 'en',
					isPartOf: { '@id': websiteId },
					author: { '@id': orgId },
					publisher: { '@id': orgId },
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
	{#if isHome}
		<link rel="alternate" type="text/plain" title="llms-full.txt" href="/llms-full.txt" />
	{/if}

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
