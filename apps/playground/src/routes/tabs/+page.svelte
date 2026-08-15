<script lang="ts">
	import { Tabs } from 'base-ui-svelte/tabs';
	import '../demo.css';
</script>

<h1>Tabs</h1>
<div class="demo">
	<Tabs.Root defaultValue="overview">
		<Tabs.List class="tablist">
			<Tabs.Tab class="tab" value="overview">Overview</Tabs.Tab>
			<Tabs.Tab class="tab" value="settings">Settings</Tabs.Tab>
			<Tabs.Tab class="tab" value="billing">Billing</Tabs.Tab>
		</Tabs.List>
		<Tabs.Panel class="panel" value="overview">Overview content</Tabs.Panel>
		<Tabs.Panel class="panel" value="settings">Settings content</Tabs.Panel>
		<Tabs.Panel class="panel" value="billing">Billing content</Tabs.Panel>
	</Tabs.Root>
</div>
