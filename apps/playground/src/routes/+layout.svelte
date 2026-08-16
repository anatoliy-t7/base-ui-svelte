<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>base-ui-svelte playground</title>
</svelte:head>

<div class="shell">
	<header>
		<a href="/" class="brand">base-ui-svelte</a>
		<p class="tag">Unofficial Base UI port — playground</p>
		<nav>
			<a href="/accordion">Accordion</a>
			<a href="/alert-dialog">Alert Dialog</a>
			<a href="/autocomplete">Autocomplete</a>
			<a href="/avatar">Avatar</a>
			<a href="/button">Button</a>
			<a href="/checkbox">Checkbox</a>
			<a href="/checkbox-group">Checkbox Group</a>
			<a href="/collapsible">Collapsible</a>
			<a href="/combobox">Combobox</a>
			<a href="/context-menu">Context Menu</a>
			<a href="/dialog">Dialog</a>
			<a href="/drawer">Drawer</a>
			<a href="/field">Field</a>
			<a href="/fieldset">Fieldset</a>
			<a href="/form">Form</a>
			<a href="/input">Input</a>
			<a href="/menu">Menu</a>
			<a href="/menubar">Menubar</a>
			<a href="/meter">Meter</a>
			<a href="/navigation-menu">Navigation Menu</a>
			<a href="/number-field">Number Field</a>
			<a href="/otp-field">OTP Field</a>
			<a href="/popover">Popover</a>
			<a href="/preview-card">Preview Card</a>
			<a href="/progress">Progress</a>
			<a href="/radio">Radio</a>
			<a href="/scroll-area">Scroll Area</a>
			<a href="/select">Select</a>
			<a href="/separator">Separator</a>
			<a href="/slider">Slider</a>
			<a href="/switch">Switch</a>
			<a href="/tabs">Tabs</a>
			<a href="/toast">Toast</a>
			<a href="/toggle">Toggle</a>
			<a href="/toolbar">Toolbar</a>
			<a href="/tooltip">Tooltip</a>
		</nav>
	</header>
	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		position: relative;
		margin: 0;
		font-family: 'IBM Plex Sans', 'Segoe UI', sans-serif;
		background:
			radial-gradient(ellipse 80% 50% at 10% -10%, #dce8f5, transparent),
			linear-gradient(180deg, #f7f4ef 0%, #ebe6de 100%);
		color: #1c242e;
		min-height: 100vh;
	}

	:global(.root) {
		isolation: isolate;
		min-height: 100vh;
	}

	.shell {
		max-width: 52rem;
		margin: 0 auto;
		padding: 2rem 1.25rem 4rem;
	}

	header {
		margin-bottom: 2.5rem;
	}

	.brand {
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: inherit;
		text-decoration: none;
	}

	.tag {
		margin: 0.35rem 0 1rem;
		color: #5a6570;
		font-size: 0.95rem;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
	}

	nav a {
		color: #0b5fff;
		text-decoration: none;
		font-weight: 500;
	}

	nav a:hover {
		text-decoration: underline;
	}

	main {
		display: grid;
		gap: 1.5rem;
	}
</style>
