import Elements, { flatten, forEachElement, selected } from '../../components/elements/elements';
import { round } from '../../utils/utils';

export default {
	addFill: (state, props) => {
		selected(state.elements).forEach((element) => {
			element.fill.push(props.payload);
		});
	},
	setFill: (state, props) => {
		selected(state.elements).forEach((element) => {
			Elements[element.type].setFill(element, props.payload);
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
	setStroke: (state, props) => {
		selected(state.elements).forEach((element) => {
			Elements[element.type].setStroke(element, props.payload);
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

	addEffect: (state, props) => {
		selected(state.elements).forEach((element) => {
			element.effect.push(props.payload);
		});
	},
	setEffect: (state, props) => {
		selected(state.elements).forEach((element) => {
			Elements[element.type].setEffect(element, props.payload);
		});
	},
	removeEffect: (state, props) => {
		const { id } = props.payload;
		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.effect = element.effect.filter((effect) => effect.id !== id);
			});
	},

	property: (state, props) => {
		selected(state.elements).forEach((element) => {
			Object.entries(props.payload).forEach(([key, value]) => {
				element[key] = value;
			});
		});
	},
	deleteSelected: (state) => {
		forEachElement(state.elements, (element, i, elements) => {
			if (element.selected === true) elements.splice(i, 1);
		});
	},
};
