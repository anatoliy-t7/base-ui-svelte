<script lang="ts">
	import { Tabs } from 'base-ui-svelte/tabs';
</script>

<h1>Tabs</h1>

<section class="demo">
	<h2>Primary (animated pill)</h2>
	<Tabs.Root class="tabs" defaultValue="overview">
		<Tabs.List class="tabs-list">
			<Tabs.Tab class="tabs-tab" value="overview">Overview</Tabs.Tab>
			<Tabs.Tab class="tabs-tab" value="settings">Settings</Tabs.Tab>
			<Tabs.Tab class="tabs-tab" value="billing">Billing</Tabs.Tab>
			<Tabs.Indicator class="tabs-indicator" />
		</Tabs.List>
		<Tabs.Panel class="tabs-panel" value="overview">Overview content</Tabs.Panel>
		<Tabs.Panel class="tabs-panel" value="settings">Settings content</Tabs.Panel>
		<Tabs.Panel class="tabs-panel" value="billing">Billing content</Tabs.Panel>
	</Tabs.Root>

	<h2>Secondary (animated underline)</h2>
	<Tabs.Root class="tabs tabs-secondary" defaultValue="account">
		<Tabs.List class="tabs-list">
			<Tabs.Tab class="tabs-tab" value="account">Account</Tabs.Tab>
			<Tabs.Tab class="tabs-tab" value="security">Security</Tabs.Tab>
			<Tabs.Tab class="tabs-tab" value="notifications">Notifications</Tabs.Tab>
			<Tabs.Indicator class="tabs-indicator" />
		</Tabs.List>
		<Tabs.Panel class="tabs-panel" value="account">Account settings</Tabs.Panel>
		<Tabs.Panel class="tabs-panel" value="security">Security settings</Tabs.Panel>
		<Tabs.Panel class="tabs-panel" value="notifications">Notification preferences</Tabs.Panel>
	</Tabs.Root>
</section>
