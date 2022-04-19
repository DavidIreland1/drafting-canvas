import Elements, { flatten, forEachElement, selected } from '../../components/canvas/elements/elements';
import { rotatePoint, rotateWithControls } from '../../utils/utils';

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

		const entry = Object.entries(props.payload.props);
		selected(state.elements, selected_ids).forEach((element) => {
			entry.forEach(([key, value]) => {
				if (key === 'x' || key === 'y') {
					const bound = Elements[element.type].bound(element);
					const delta = Number(value) - bound[key];
					element.points.forEach((point) => {
						point[key] += delta;
						point.controls.forEach((control) => {
							control[key] += delta;
						});
					});
				} else if (key === 'radius') {
					element.points.forEach((point) => (point[key] = value));
				} else if (key === 'rotation') {
					const center = Elements[element.type].center(element);
					const delta = Number(value) - element.rotation;
					element.rotation = Number(value);
					element.points.forEach((point) => {
						const rotated = rotatePoint(point, center, delta);
						point.x = rotated.x;
						point.y = rotated.y;
						point.controls.forEach((control) => {
							const rotated = rotatePoint(control, center, delta);
							control.x = rotated.x;
							control.y = rotated.y;
						});
					});
				} else if (key === 'width' || key === 'height') {
					const bound = Elements[element.type].bound(element);
					const center = Elements[element.type].center(element);
					const ratio = Number(value) / bound[key];

					const axis = key === 'width' ? 'x' : 'y';

					element.points.forEach((point) => {
						const rotated = rotatePoint(point, center, -element.rotation);
						point.x = rotated.x;
						point.y = rotated.y;
						point.controls.forEach((control) => {
							const rotated = rotatePoint(control, center, -element.rotation);
							control.x = rotated.x;
							control.y = rotated.y;
						});
						point[axis] = (point[axis] - bound[axis]) * ratio + bound[axis];

						point.controls.forEach((control) => {
							control[axis] = (control[axis] - bound[axis]) * ratio + bound[axis];
						});

						const un_rotated = rotatePoint(point, center, element.rotation);
						point.x = un_rotated.x;
						point.y = un_rotated.y;
						point.controls.forEach((control) => {
							const rotated = rotatePoint(control, center, element.rotation);
							control.x = rotated.x;
							control.y = rotated.y;
						});
					});
				} else {
					element[key] = value;
				}
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
