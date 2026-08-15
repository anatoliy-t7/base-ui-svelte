<script lang="ts">
	import { useDirection } from '../src/direction-provider/index.js';

	const direction = useDirection();
</script>

<span data-testid="direction">{direction}</span>
