<script lang="ts">
	import { DirectionProvider } from '../src/direction-provider/index.js';
	import type { TextDirection } from '../src/direction-provider/index.js';
	import DirectionReader from './direction-reader.test.svelte';

	let { direction = 'ltr' }: { direction?: TextDirection } = $props();
</script>

<DirectionProvider {direction}>
	<DirectionReader />
</DirectionProvider>
