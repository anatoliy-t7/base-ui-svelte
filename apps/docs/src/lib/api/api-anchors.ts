/** Base UI-style anchor id for a part heading, e.g. `NumberField.Root` → `NumberFieldRoot`. */
export function partAnchorId(heading: string): string {
	return heading.replace(/\./g, '');
}

/** Base UI-style anchor id for a prop, e.g. `NumberFieldRoot-value`. */
export function propAnchorId(partHeading: string, propName: string): string {
	return `${partAnchorId(partHeading)}-${propName}`;
}
