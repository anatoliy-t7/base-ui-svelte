<script lang="ts">
	import { Accordion } from 'base-ui-svelte/accordion';
</script>

<Accordion.Root class="accordion" defaultValue={['what']}>
	<Accordion.Item class="accordion-item" value="what">
		<Accordion.Header class="accordion-header">
			<Accordion.Trigger class="accordion-trigger">What is Base UI?</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel class="accordion-panel">
			<div class="accordion-content">
				Unstyled accessible components for design systems and apps.
			</div>
		</Accordion.Panel>
	</Accordion.Item>
	<Accordion.Item class="accordion-item" value="start">
		<Accordion.Header class="accordion-header">
			<Accordion.Trigger class="accordion-trigger">How do I get started?</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel class="accordion-panel">
			<div class="accordion-content">
				Install the package and compose namespace parts like Root, Trigger, and Panel.
			</div>
		</Accordion.Panel>
	</Accordion.Item>
	<Accordion.Item class="accordion-item" value="license">
		<Accordion.Header class="accordion-header">
			<Accordion.Trigger class="accordion-trigger">Can I use it for my project?</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Panel class="accordion-panel">
			<div class="accordion-content">Yes — MIT licensed community port.</div>
		</Accordion.Panel>
	</Accordion.Item>
</Accordion.Root>
