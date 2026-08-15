<script lang="ts">
	import { OTPField } from 'base-ui-svelte/otp-field';
	import '../demo.css';

	let complete = $state('');
</script>

<h1>OTP Field</h1>
<div class="demo">
	<OTPField.Root
		class="otp"
		length={4}
		name="otp"
		onComplete={(v: string) => {
			complete = v;
		}}
	>
		<OTPField.Input class="otp-digit" />
		<OTPField.Input class="otp-digit" />
		<OTPField.Separator class="otp-sep">–</OTPField.Separator>
		<OTPField.Input class="otp-digit" />
		<OTPField.Input class="otp-digit" />
	</OTPField.Root>
	{#if complete}
		<p class="muted">Complete: {complete}</p>
	{/if}
</div>
