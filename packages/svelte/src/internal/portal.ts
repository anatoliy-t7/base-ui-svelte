import type { Attachment } from 'svelte/attachments';

export type PortalTarget = HTMLElement | string | null | undefined;

/**
 * Attachment that moves the element into `document.body` (or a custom target).
 */
export function portal(target: PortalTarget = 'body'): Attachment {
	return (element) => {
		const resolve = (): HTMLElement | null => {
			if (target == null || target === 'body') {
				return document.body;
			}
			if (typeof target === 'string') {
				return document.querySelector(target);
			}
			return target;
		};

		const container = resolve();
		if (!container) return;

		container.append(element);

		return () => {
			element.remove();
		};
	};
}
