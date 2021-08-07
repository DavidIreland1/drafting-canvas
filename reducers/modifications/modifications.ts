import interactions from './interactions';
import properties from './properties';

const modifications = {
	...interactions,
	...properties,
};

export default modifications;

export const modification_types = Object.keys(modifications);
