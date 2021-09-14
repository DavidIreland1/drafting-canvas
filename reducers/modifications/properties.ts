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
	toggleFill: (state, props) => {
		const { id } = props.payload;
		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.fill.forEach((fill) => {
					if (fill.id === id) fill.visible = !fill.visible;
				});
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
	toggleStroke: (state, props) => {
		const { id } = props.payload;
		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.stroke.forEach((stroke) => {
					if (stroke.id === id) stroke.visible = !stroke.visible;
				});
			});
	},

	strokeWidth: (state, props) => {
		const { id, width } = props.payload;
		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.stroke.forEach((stroke) => {
					if (stroke.id === id) stroke.width = width;
				});
			});
	},

	addEffect: (state, props) => {
		selected(state.elements).forEach((element) => {
			element.effect.push(props.payload);
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
	toggleEffect: (state, props) => {
		const { id } = props.payload;
		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.effect.forEach((effect) => {
					if (effect.id === id) effect.visible = !effect.visible;
				});
			});
	},
	effect: (state, props) => {
		const { id } = props.payload;

		flatten(state.elements)
			.filter((element) => element.type !== 'group')
			.forEach((element) => {
				element.effect.forEach((effect) => {
					if (effect.id === id) {
						Object.entries(props.payload).forEach(([key, value]) => {
							effect[key] = value;
						});
					}
				});
			});
	},

	setColor: (state, props) => {
		selected(state.elements).forEach((element) => {
			// Probs shouldn't have all in the same function
			Elements[element.type].setFill(element, props.payload);
			Elements[element.type].setStroke(element, props.payload);
			Elements[element.type].setEffect(element, props.payload);
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
