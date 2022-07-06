import Elements, { flatten } from '../components/canvas/elements/elements';

// These reduces do not affect other users on the document

const tools = {
	hoverOnly: (state, props) => {
		flatten(state.elements).forEach((element) => (element.hover = element.id === props.payload.id));
	},
	select: (state, props) => {
		const element = flatten(state.elements).find((element) => element.id === props.payload.id);
		if (element) element.selected = true;
	},
	selectPoint: (state, props) => {
		const { id, point_id, control_index } = props.payload;

		const element = flatten(state.elements).find((element) => element.id === id);
		if (element) {
			const point = Elements[element.type].getPoints(element).find((point) => point.id === point_id);
			if (point) {
				if (control_index === undefined) {
					point.selected = true;
				} else {
					point.controls[control_index].selected = true;
				}
			}
		}
	},

	selectPointOnly: (state, props) => {
		const { id, point_id, control_index } = props.payload;

		const element = flatten(state.elements).find((element) => element.id === id);
		if (element) {
			Elements[element.type].getPoints(element).forEach((point) => {
				point.selected = false;
				point.controls.forEach((control) => (control.selected = false));

				if (point.id === point_id) {
					if (control_index === undefined) {
						point.selected = true;
					} else {
						point.controls[control_index].selected = true;
					}
				}
			});
		}
	},
	selectOnly: (state, props) => {
		flatten(state.elements).forEach((element) => (element.selected = element.id === props.payload.id));
	},
	unselect: (state, props) => {
		const element = flatten(state.elements).find((element) => element.id === props.payload.id);
		if (element) {
			element.selected = false;
			element.editing = false;
			Elements[element.type].getPoints(element).forEach((point) => (point.selected = false));
		}
	},
	selectAll: (state) => {
		flatten(state.elements).forEach((element) => (element.selected = true));
	},
	unselectAll: (state) => {
		flatten(state.elements).forEach((element) => {
			element.selected = false;
			element.editing = false;
			Elements[element.type].getPoints(element).forEach((point) => (point.selected = false));
		});
	},
	editOnly: (state, props) => {
		const element = flatten(state.elements).find((element) => element.id === props.payload.id);
		if (element) element.editing = true;
	},
};

export default tools;

export const tool_actions = Object.keys(tools);
