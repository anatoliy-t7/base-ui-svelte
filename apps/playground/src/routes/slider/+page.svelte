<script lang="ts">
	import { Slider } from 'base-ui-svelte/slider';
	import '../demo.css';

	let volume = $state(40);
</script>

<h1>Slider</h1>
<div class="demo">
	<Slider.Root class="slider" bind:value={volume} aria-label="Volume">
		<Slider.Label>Volume</Slider.Label>
		<Slider.Value />
		<Slider.Control class="slider-control">
			<Slider.Track class="slider-track">
				<Slider.Indicator class="slider-indicator" />
				<Slider.Thumb class="slider-thumb" />
			</Slider.Track>
		</Slider.Control>
	</Slider.Root>
</div>
