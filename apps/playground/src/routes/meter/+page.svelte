<script lang="ts">
	import { Meter } from 'base-ui-svelte/meter';
	import '../demo.css';
</script>

<h1>Meter</h1>
<div class="demo">
	<Meter.Root class="meter" value={24}>
		<Meter.Label>Storage used</Meter.Label>
		<Meter.Value />
		<Meter.Track class="meter-track">
			<Meter.Indicator class="meter-indicator" />
		</Meter.Track>
	</Meter.Root>
</div>
