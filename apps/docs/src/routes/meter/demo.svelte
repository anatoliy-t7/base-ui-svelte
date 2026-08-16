<script lang="ts">
	import { Meter } from 'base-ui-svelte/meter';
</script>

<Meter.Root class="meter" value={24}>
	<Meter.Label class="meter-label">Storage used</Meter.Label>
	<Meter.Value class="meter-value" />
	<Meter.Track class="meter-track">
		<Meter.Indicator class="meter-indicator" />
	</Meter.Track>
</Meter.Root>
