<script lang="ts">
	import { Accordion } from '../src/index.js';

	let {
		multiple = false,
		defaultValue
	}: {
		multiple?: boolean;
		defaultValue?: string | string[];
	} = $props();
</script>

<Accordion.Root {multiple} {defaultValue} data-testid="accordion-root">
	<Accordion.Item value="one" data-testid="item-one">
		<Accordion.Header>
			<Accordion.Trigger data-testid="trigger-one">One</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel data-testid="panel-one">Panel one</Accordion.Panel>
	</Accordion.Item>
	<Accordion.Item value="two" data-testid="item-two">
		<Accordion.Header>
			<Accordion.Trigger data-testid="trigger-two">Two</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel data-testid="panel-two">Panel two</Accordion.Panel>
	</Accordion.Item>
</Accordion.Root>
