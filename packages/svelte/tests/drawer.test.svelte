<script lang="ts">
	import { Drawer } from '../src/drawer/index.js';

	let {
		snapPoints,
		withVirtualKeyboard = false,
	}: {
		snapPoints?: ReadonlyArray<number | string>;
		withVirtualKeyboard?: boolean;
	} = $props();
</script>

{#snippet drawerTree()}
	<Drawer.Trigger data-testid="trigger">Open</Drawer.Trigger>
	<Drawer.SwipeArea data-testid="swipe-area" />
	<Drawer.Portal>
		<Drawer.Backdrop data-testid="backdrop" />
		<Drawer.Viewport data-testid="viewport">
			<Drawer.Popup data-testid="popup">
				<Drawer.Content data-testid="content">
					<Drawer.Title>Title</Drawer.Title>
					<Drawer.Description>Description</Drawer.Description>
					<input data-testid="field" />
					<Drawer.Close data-testid="close">Close</Drawer.Close>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
{/snippet}

<Drawer.Provider swipeDirection="down">
	<Drawer.IndentBackground data-testid="indent-background" />
	<Drawer.Indent data-testid="indent">
		<Drawer.Root data-testid="drawer-root" {snapPoints}>
			{#if withVirtualKeyboard}
				<Drawer.VirtualKeyboardProvider data-testid="vk-provider">
					{@render drawerTree()}
				</Drawer.VirtualKeyboardProvider>
			{:else}
				{@render drawerTree()}
			{/if}
		</Drawer.Root>
	</Drawer.Indent>
</Drawer.Provider>
