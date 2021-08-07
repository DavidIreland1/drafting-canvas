import { flatten } from '../components/elements/elements';

export default {
	hover: (state, props) => {
		state.elements.find((element) => element.id === props.payload.id).hover = true;
	},
	unhover: (state, props) => {
		state.elements.find((element) => element.id === props.payload.id).hover = false;
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
		if (element) element.selected = false;
	},
	selectAll: (state) => {
		flatten(state.elements).forEach((element) => (element.selected = true));
	},
	unselectAll: (state) => {
		flatten(state.elements).forEach((element) => (element.selected = false));
	},
};
