import { rotatePoints, scalePoints } from '../../components/canvas/elements/element';
import Elements, { flatten, forEachElement, selected } from '../../components/canvas/elements/elements';
import { rotatePoint } from '../../utils/utils';

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
			entry.forEach(([key, value]) => {
				const delta = Number(value);
				if (key === 'x' || key === 'y') {
					Elements[element.type].getPoints(element).forEach((point) => {
						point[key] += delta;
						point.controls.forEach((control) => (control[key] += delta));
					});
				} else if (key === 'radius') {
					Elements[element.type].getPoints(element).forEach((point) => (point[key] = delta));
				} else if (key === 'rotation') {
					const center = Elements[element.type].center(element);
					const sin = Math.sin(delta);
					const cos = Math.cos(delta);

					element.rotation = (element.rotation + delta) % (Math.PI * 2);
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
					const bounds = Elements[element.type].bound(element);
					const center = Elements[element.type].center(element);

					const axis = key === 'width' ? 'x' : 'y';

					// const ratio = (delta + bound[key] || 0.00001) / bound[key];
					// const sin = Math.sin(element.rotation);
					// const cos = Math.cos(element.rotation);

					// Elements[element.type].getPoints(element).forEach((point) => {
					// 	const rotated = rotatePoint(point, center, -sin, cos);
					// 	point.x = rotated.x;
					// 	point.y = rotated.y;
					// 	point.controls.forEach((control) => {
					// 		const rotated = rotatePoint(control, center, -sin, cos);
					// 		control.x = rotated.x;
					// 		control.y = rotated.y;
					// 	});
					// 	point[axis] = (point[axis] - bound[axis]) * ratio + bound[axis] + extra;

					// 	point.controls.forEach((control) => {
					// 		control[axis] = (control[axis] - bound[axis]) * ratio + bound[axis] + extra;
					// 	});

					// 	const un_rotated = rotatePoint(point, center, sin, cos);
					// 	point.x = un_rotated.x;
					// 	point.y = un_rotated.y;
					// 	point.controls.forEach((control) => {
					// 		const rotated = rotatePoint(control, center, sin, cos);
					// 		control.x = rotated.x;
					// 		control.y = rotated.y;
					// 	});
					// });

					const sin = Math.sin(element.rotation);
					const cos = Math.cos(element.rotation);
					rotatePoints(element, center, -sin, cos);

					const ratio = (bounds[key] + delta) / (bounds[key] || 0.0000001); // avoid ratio of zero

					// Top left of resize box
					const old_min = Math.min(...Elements[element.type].getPoints(element).map((point) => point[axis]));

					console.log();

					const new_min = bounds[key] + delta < 0 ? old_min - delta / 2 : old_min;
					// const new_min = Math.min(bounds[axis] + delta, bounds[axis]);

					scalePoints(element, axis, old_min, ratio, new_min);

					// Rotate points back
					rotatePoints(element, center, sin, cos);
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
	page: (state, props) => {
		Object.entries(props.payload).forEach(([key, value]) => (state.page[key] = value));
	},
};

export default properties;
