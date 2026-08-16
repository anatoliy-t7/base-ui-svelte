<script lang="ts">
	import { DirectionProvider } from '../src/direction-provider/index.js';
	import { Slider } from '../src/slider/index.js';
	import type { TextDirection } from '../src/direction-provider/index.js';
	import type { SliderValue } from '../src/slider/index.js';

	let {
		value = 40,
		direction = 'ltr',
		withProvider = false,
	}: {
		value?: SliderValue;
		direction?: TextDirection;
		withProvider?: boolean;
	} = $props();
</script>

{#snippet slider()}
	<Slider.Root {value} data-testid="slider" name="volume">
		<Slider.Label data-testid="label">Volume</Slider.Label>
		<Slider.Value data-testid="value" />
		<Slider.Control data-testid="control">
			<Slider.Track data-testid="track">
				<Slider.Indicator data-testid="indicator" />
				{#if Array.isArray(value)}
					<Slider.Thumb index={0} data-testid="thumb-0" />
					<Slider.Thumb index={1} data-testid="thumb-1" />
				{:else}
					<Slider.Thumb data-testid="thumb" />
				{/if}
			</Slider.Track>
		</Slider.Control>
	</Slider.Root>
{/snippet}

{#if withProvider}
	<DirectionProvider {direction}>
		{@render slider()}
	</DirectionProvider>
{:else}
	{@render slider()}
{/if}
