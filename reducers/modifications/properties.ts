import Elements, { flatten, forEachElement, selected } from '../../components/elements/elements';
import { round } from '../../utils/utils';

export default {
	addFill: (state, props) => {
		selected(state.elements).forEach((element) => {
			element.fill.push(props.payload);
		});
	},
	removeFill: (state, props) => {
		const { id } = props.payload;
		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.fill = element.fill.filter((fill) => fill.id !== id);
			});
	},
	addStroke: (state, props) => {
		selected(state.elements).forEach((element) => {
			element.stroke.push(props.payload);
		});
	},
	removeStroke: (state, props) => {
		const { id } = props.payload;
		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.stroke = element.stroke.filter((stroke) => stroke.id !== id);
			});
	},
	setColor: (state, props) => {
		selected(state.elements).forEach((element) => {
			Elements[element.type].setFill(element, props.payload);
			Elements[element.type].setStroke(element, props.payload);
		});
	},
	property: (state, props) => {
		selected(state.elements).forEach((element) => {
			Object.entries(props.payload).forEach(([key, value]) => {
				element[key] = round(value, 2);
			});
		});
	},
	deleteSelected: (state) => {
		forEachElement(state.elements, (element, i, elements) => {
			if (element.selected === true) elements.splice(i, 1);
		});
	},
};
