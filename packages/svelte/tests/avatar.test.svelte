<script lang="ts">
	import { Avatar } from '../src/avatar/index.js';
</script>

<Avatar.Root data-testid="avatar">
	<Avatar.Image data-testid="image" src="https://example.com/avatar.png" alt="Ada" />
	<Avatar.Fallback data-testid="fallback">AD</Avatar.Fallback>
</Avatar.Root>
