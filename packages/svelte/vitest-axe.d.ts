/// <reference types="@testing-library/jest-dom/vitest" />
/// <reference types="vitest/globals" />

declare module 'vitest' {
	interface Assertion<T> {
		toHaveNoViolations(): T;
	}
	interface AsymmetricMatchersContaining {
		toHaveNoViolations(): void;
	}
}

export {};
