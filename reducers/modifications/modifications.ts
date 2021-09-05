import interactions from './interactions';
import properties from './properties';

// Modification types can be undone / redone

const modifications = {
	...interactions,
	...properties,
};

export default modifications;

export const modification_actions = Object.keys(modifications);
