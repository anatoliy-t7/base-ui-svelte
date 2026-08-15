<script lang="ts">
	import { CspProvider } from '../src/csp-provider/index.js';
	import CspReader from './csp-reader.test.svelte';

	let { nonce }: { nonce?: string } = $props();
</script>

<CspProvider {nonce}>
	<CspReader />
</CspProvider>
