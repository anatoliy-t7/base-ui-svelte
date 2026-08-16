<script lang="ts">
	import { OTPField } from 'base-ui-svelte/otp-field';

	let complete = $state('');
</script>

<h1>OTP Field</h1>

<section class="demo">
	<OTPField.Root
		class="otp-field"
		length={4}
		name="otp"
		onComplete={(v: string) => {
			complete = v;
		}}
	>
		<OTPField.Input class="otp-field-input" />
		<OTPField.Input class="otp-field-input" />
		<OTPField.Separator class="otp-field-separator">–</OTPField.Separator>
		<OTPField.Input class="otp-field-input" />
		<OTPField.Input class="otp-field-input" />
	</OTPField.Root>
	{#if complete}
		<p class="muted">Complete: {complete}</p>
	{/if}
</section>
