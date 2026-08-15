<script lang="ts">
	import { OTPField } from '../src/otp-field/index.js';
</script>

<OTPField.Root length={4} name="otp" data-testid="root">
	<OTPField.Input data-testid="digit-0" />
	<OTPField.Input data-testid="digit-1" />
	<OTPField.Separator data-testid="separator" />
	<OTPField.Input data-testid="digit-2" />
	<OTPField.Input data-testid="digit-3" />
</OTPField.Root>
