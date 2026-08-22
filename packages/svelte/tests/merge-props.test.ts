import { describe, expect, it } from 'vitest';
import { mergeProps } from '../src/merge-props/index.js';

describe('mergeProps', () => {
	it('concatenates class strings', () => {
		const merged = mergeProps({ class: 'a' }, { class: 'b' }, { className: 'c' });
		expect(merged.class).toBe('a b c');
	});

	it('composes event handlers', () => {
		const calls: string[] = [];
		const merged = mergeProps(
			{
				onclick: () => {
					calls.push('first');
				},
			},
			{
				onclick: () => {
					calls.push('second');
				},
			},
		);
		const handler = merged.onclick as () => void;
		handler();
		expect(calls).toEqual(['first', 'second']);
	});

	it('lets later props win for normal keys', () => {
		const merged = mergeProps({ id: 'a', 'data-x': '1' }, { id: 'b' });
		expect(merged.id).toBe('b');
		expect(merged['data-x']).toBe('1');
	});

	it('preserves symbol keys such as attachments', () => {
		const attachmentKey = Symbol('attachment');
		const first = () => {};
		const second = () => {};
		const merged = mergeProps({ [attachmentKey]: first }, { [attachmentKey]: second });
		expect(merged[attachmentKey]).toBe(second);
	});
});
