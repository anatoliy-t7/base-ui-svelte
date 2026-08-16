<script lang="ts">
	import { Avatar } from 'base-ui-svelte/avatar';
</script>

<h1>Avatar</h1>

<section class="demo">
	<h2>Sizes</h2>
	<div class="row">
		<Avatar.Root class="avatar avatar-sm">
			<Avatar.Image
				src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
				alt=""
				width="32"
				height="32"
			/>
			<Avatar.Fallback class="avatar-fallback" delay={600}>LT</Avatar.Fallback>
		</Avatar.Root>
		<Avatar.Root class="avatar avatar-md">
			<Avatar.Image
				src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
				alt=""
				width="48"
				height="48"
			/>
			<Avatar.Fallback class="avatar-fallback" delay={600}>LT</Avatar.Fallback>
		</Avatar.Root>
		<Avatar.Root class="avatar avatar-lg">
			<Avatar.Image
				src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
				alt=""
				width="64"
				height="64"
			/>
			<Avatar.Fallback class="avatar-fallback" delay={600}>LT</Avatar.Fallback>
		</Avatar.Root>
		<Avatar.Root class="avatar avatar-md">
			<Avatar.Fallback class="avatar-fallback">LT</Avatar.Fallback>
		</Avatar.Root>
	</div>
</section>
