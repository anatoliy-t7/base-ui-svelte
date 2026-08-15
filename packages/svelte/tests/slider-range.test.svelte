<script lang="ts">
	import { Slider } from '../src/slider/index.js';

	let {
		value = [20, 60]
	}: {
		value?: number[];
	} = $props();
</script>

<Slider.Root {value} data-testid="slider">
	<Slider.Label data-testid="label">Price</Slider.Label>
	<Slider.Value data-testid="value" />
	<Slider.Control data-testid="control">
		<Slider.Track data-testid="track">
			<Slider.Indicator data-testid="indicator" />
			<Slider.Thumb index={0} data-testid="thumb-min" aria-label="Minimum" />
			<Slider.Thumb index={1} data-testid="thumb-max" aria-label="Maximum" />
		</Slider.Track>
	</Slider.Control>
</Slider.Root>
