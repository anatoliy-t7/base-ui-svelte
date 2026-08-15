<script lang="ts">
	import { Avatar } from 'base-ui-svelte/avatar';
	import '../demo.css';
</script>

<h1>Avatar</h1>
<div class="demo">
	<div class="sep-row">
		<Avatar.Root class="avatar">
			<Avatar.Image
				src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
				alt=""
				width="48"
				height="48"
			/>
			<Avatar.Fallback delay={600}>LT</Avatar.Fallback>
		</Avatar.Root>
		<Avatar.Root class="avatar">LT</Avatar.Root>
	</div>
</div>
