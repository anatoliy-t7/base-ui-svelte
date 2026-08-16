<script lang="ts">
	import { HOME_FAQS } from './home-seo.js';
</script>

<section class="home-faq" aria-labelledby="home-faq-heading">
	<h2 id="home-faq-heading">Frequently asked questions</h2>
	{#each HOME_FAQS as item (item.question)}
		<h3>{item.question}</h3>
		<p>{item.answer}</p>
	{/each}
</section>
