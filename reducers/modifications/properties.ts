import Elements, { flatten, forEachElement, selected } from '../../components/canvas/elements/elements';
import { rotatePoint } from '../../utils/utils';

let last_value = 0;
const properties = {
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
			entry.forEach(([key, _value]) => {
				const value = Number(_value);
				if (key === 'x' || key === 'y') {
					const bound = Elements[element.type].bound(element);
					const delta = value - bound[key];
					Elements[element.type].getPoints(element).forEach((point) => {
						point[key] += delta;
						point.controls.forEach((control) => {
							control[key] += delta;
						});
					});
				} else if (key === 'radius') {
					Elements[element.type].getPoints(element).forEach((point) => (point[key] = value));
				} else if (key === 'rotation') {
					const center = Elements[element.type].center(element);
					const delta = value - element.rotation;

					const sin = Math.sin(delta);
					const cos = Math.cos(delta);

					element.rotation = value % (Math.PI * 2);
					Elements[element.type].getPoints(element).forEach((point) => {
						const rotated = rotatePoint(point, center, sin, cos);
						point.x = rotated.x;
						point.y = rotated.y;
						point.controls.forEach((control) => {
							const rotated = rotatePoint(control, center, sin, cos);
							control.x = rotated.x;
							control.y = rotated.y;
						});
					});
				} else if (key === 'width' || key === 'height') {
					const bound = Elements[element.type].bound(element);
					const center = Elements[element.type].center(element);

					const axis = key === 'width' ? 'x' : 'y';
					const ratio = Math.abs((value || 0.00001) / bound[key]);

					console.log(value, last_value);
					const delta = value < 0 && last_value < 0 ? (value || 0.00001) + bound[key] : 0;
					last_value = value;
					const sin = Math.sin(element.rotation);
					const cos = Math.cos(element.rotation);

					Elements[element.type].getPoints(element).forEach((point) => {
						const rotated = rotatePoint(point, center, -sin, cos);
						point.x = rotated.x;
						point.y = rotated.y;
						point.controls.forEach((control) => {
							const rotated = rotatePoint(control, center, -sin, cos);
							control.x = rotated.x;
							control.y = rotated.y;
						});
						point[axis] = (point[axis] - bound[axis]) * ratio + bound[axis] + delta;

						point.controls.forEach((control) => {
							control[axis] = (control[axis] - bound[axis]) * ratio + bound[axis] + delta;
						});

						const un_rotated = rotatePoint(point, center, sin, cos);
						point.x = un_rotated.x;
						point.y = un_rotated.y;
						point.controls.forEach((control) => {
							const rotated = rotatePoint(control, center, sin, cos);
							control.x = rotated.x;
							control.y = rotated.y;
						});
					});
				} else {
					element[key] = _value;
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
	page: (state, props) => {
		Object.entries(props.payload).forEach(([key, value]) => (state.page[key] = value));
	},
};

export default properties;
