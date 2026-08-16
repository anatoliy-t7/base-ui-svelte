<script lang="ts">
	import { Tabs } from '../src/index.js';
</script>

<Tabs.Root defaultValue="one" data-testid="tabs">
	<Tabs.List data-testid="list">
		<Tabs.Tab value="one" data-testid="tab-one">One</Tabs.Tab>
		<Tabs.Tab value="two" data-testid="tab-two">Two</Tabs.Tab>
		<Tabs.Indicator data-testid="indicator" />
	</Tabs.List>
	<Tabs.Panel value="one" data-testid="panel-one">Panel one</Tabs.Panel>
	<Tabs.Panel value="two" data-testid="panel-two">Panel two</Tabs.Panel>
</Tabs.Root>
