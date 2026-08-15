<script lang="ts">
	import { useNonce } from '../src/csp-provider/index.js';

	const nonce = useNonce();
</script>

<span data-testid="nonce">{nonce ?? 'none'}</span>
