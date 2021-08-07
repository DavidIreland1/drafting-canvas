import Elements, { forEachElement, selected } from '../../components/elements/elements';
import { round } from '../../utils/utils';

export default {
	addFill: (state, props) => {
		selected(state.elements).forEach((element) => {
			element.fill.push(props.payload);
		});
	},
	setColor: (state, props) => {
		selected(state.elements).forEach((element) => {
			Elements[element.type].setFill(element, props.payload);
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
