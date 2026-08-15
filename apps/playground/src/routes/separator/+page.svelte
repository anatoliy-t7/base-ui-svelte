<script lang="ts">
	import { Separator } from 'base-ui-svelte/separator';
	import '../demo.css';
</script>

<h1>Separator</h1>
<div class="demo">
	<div class="sep-row">
		<a href="#home">Home</a>
		<a href="#pricing">Pricing</a>
		<a href="#blog">Blog</a>
		<Separator.Root orientation="vertical" class="sep" />
		<a href="#login">Log in</a>
	</div>
</div>
