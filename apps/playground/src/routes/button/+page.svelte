<script lang="ts">
	import { Button } from 'base-ui-svelte/button';
</script>

<h1>Button</h1>

<section class="demo">
	<h2>Variants (class names)</h2>
	<div class="row">
		<Button class="btn btn-primary">Primary</Button>
		<Button class="btn btn-secondary">Secondary</Button>
		<Button class="btn btn-outline">Outline</Button>
		<Button class="btn btn-ghost">Ghost</Button>
		<Button class="btn btn-danger">Danger</Button>
	</div>

	<h2>Sizes</h2>
	<div class="row">
		<Button class="btn btn-primary btn-sm">Small</Button>
		<Button class="btn btn-primary btn-md">Medium</Button>
		<Button class="btn btn-primary btn-lg">Large</Button>
		<Button class="btn btn-primary btn-icon btn-sm" aria-label="Add">+</Button>
	</div>

	<h2>States</h2>
	<div class="row">
		<Button class="btn btn-secondary" disabled>Disabled</Button>
		<Button class="btn btn-secondary" disabled focusableWhenDisabled>Focusable when disabled</Button
		>
	</div>
</section>
