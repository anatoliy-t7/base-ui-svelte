<script lang="ts">
	import { Button } from 'base-ui-svelte/button';
	import { buttonMotionPress } from '@base-ui-svelte/styles';

	const attachButtonMotionPress = buttonMotionPress();
</script>

<h3>Button press (yui540 #50)</h3>
<p>
	Press and release (pointer or Space/Enter). Uses <code>data-motion-phase="press"</code> /
	<code>data-motion-phase="release"</code> via <code>buttonMotionPress()</code>.
</p>
<div class="btn-motion-stage">
	<Button
		class="btn btn-primary btn-icon btn-motion-press btn-motion-press-plus"
		aria-label="Add"
		{@attach attachButtonMotionPress}
	>
		<span class="btn-motion-press__icon btn-motion-press__icon-plus" aria-hidden="true"></span>
	</Button>
	<Button
		class="btn btn-primary btn-lg btn-motion-press btn-motion-press-plus"
		{@attach attachButtonMotionPress}
	>
		<span class="btn-motion-press__sizer" aria-hidden="true">Save</span>
		<span class="btn-motion-press__label">Save</span>
	</Button>
</div>
