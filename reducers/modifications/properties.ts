import Elements, { flatten, forEachElement, selected } from '../../components/elements/elements';

const property_reducers = {
	addFill: (state, props) => {
		const { selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => {
			element.fill.push(props.payload.props);
		});
	},
	setFill: (state, props) => {
		const { selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => {
			Elements[element.type].setFill(element, props.payload.props);
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
		const { selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => {
			element.stroke.push(props.payload.props);
		});
	},
	setStroke: (state, props) => {
		const { selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => {
			Elements[element.type].setStroke(element, props.payload.props);
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
		const { selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => {
			element.effect.push(props.payload.props);
		});
	},
	setEffect: (state, props) => {
		const { selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => {
			Elements[element.type].setEffect(element, props.payload.props);
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
		const { selected_ids } = props.payload;
		selected(state.elements, selected_ids).forEach((element) => {
			Object.entries(props.payload.props).forEach(([key, value]) => {
				element[key] = value;
			});
		});
	},
	delete: (state, props) => {
		const { selected_ids } = props.payload;
		forEachElement(state.elements, (element, i, elements) => {
			if (selected_ids.includes(element.id)) elements.splice(i, 1);
		});
	},
	setBackground: (state, props) => {
		state.page = props.payload;
	},
};

export default property_reducers;
