import { flatten } from '../components/elements/elements';

const tools = {
	hoverOnly: (state, props) => {
		flatten(state.elements).forEach((element) => (element.hover = element.id === props.payload.id));
	},
	select: (state, props) => {
		const element = flatten(state.elements).find((element) => element.id === props.payload.id);
		if (element) element.selected = true;
	},
	selectOnly: (state, props) => {
		flatten(state.elements).forEach((element) => (element.selected = props.payload.select.includes(element.id)));
	},
	unselect: (state, props) => {
		const element = flatten(state.elements).find((element) => element.id === props.payload.id);
		if (element) {
			element.selected = false;
			element.editing = false;
		}
	},
	selectAll: (state) => {
		flatten(state.elements).forEach((element) => (element.selected = true));
	},
	unselectAll: (state) => {
		flatten(state.elements).forEach((element) => {
			element.selected = false;
			element.editing = false;
		});
	},
	editOnly: (state, props) => {
		const element = flatten(state.elements).find((element) => element.id === props.payload.id);
		if (element) element.editing = true;
	},
};

export default tools;

export const tool_actions = Object.keys(tools);
