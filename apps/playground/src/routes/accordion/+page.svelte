<script lang="ts">
	import { Accordion } from 'base-ui-svelte/accordion';
	import '../demo.css';
</script>

<h1>Accordion</h1>
<div class="demo">
	<Accordion.Root class="accordion" defaultValue={['what']}>
		<Accordion.Item class="accordion-item" value="what">
			<Accordion.Header>
				<Accordion.Trigger class="accordion-trigger">What is Base UI?</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class="accordion-panel">
				Unstyled accessible components for design systems and apps.
			</Accordion.Panel>
		</Accordion.Item>
		<Accordion.Item class="accordion-item" value="start">
			<Accordion.Header>
				<Accordion.Trigger class="accordion-trigger">How do I get started?</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class="accordion-panel">
				Install the package and compose namespace parts like Root, Trigger, and Panel.
			</Accordion.Panel>
		</Accordion.Item>
		<Accordion.Item class="accordion-item" value="license">
			<Accordion.Header>
				<Accordion.Trigger class="accordion-trigger">Can I use it for my project?</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Panel class="accordion-panel">Yes — MIT licensed community port.</Accordion.Panel>
		</Accordion.Item>
	</Accordion.Root>
</div>
