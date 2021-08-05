import Elements, { flatten, forEachElement } from '../components/elements/elements';

export default {
	overwrite: (state, props) => {
		Object.entries(props.payload.state).forEach(([key, value]) => {
			state[key] = value;
		});
	},
	addUser: (state, props) => {
		const { user_id, label } = props.payload;
		state.views.push({ id: user_id, label: label, x: 0, y: 0, scale: 1 });
		state.cursors.push({ id: user_id, label: label, x: 0, y: 0, rotation: 0, type: 'none' });
	},
	view: (state, props) => {
		const { id, delta_x, delta_y, delta_scale, cursor_x, cursor_y } = props.payload;
		const view = state.views.find((view) => id === view.id);
		if (delta_x) view.x += delta_x;
		if (delta_y) view.y += delta_y;
		if (delta_scale) view.scale += delta_scale;

		const cursor = state.cursors.find((cursor) => id === cursor.id);
		if (cursor_x) cursor.x = cursor_x;
		if (cursor_y) cursor.y = cursor_y;
	},
	cursor: (state, props) => {
		const { id, x, y, rotation, type } = props.payload;
		const cursor = state.cursors.find((cursor) => id === cursor.id);
		if (!cursor) return;
		if (x) cursor.x = x;
		if (y) cursor.y = y;
		if (rotation) cursor.rotation = rotation;
		if (type) cursor.type = type;
	},
	property: (state, props) => {
		flatten(state.elements)
			.filter((element) => element.selected)
			.forEach((element) => {
				Object.entries(props.payload).forEach(([key, value]) => {
					element[key] = round(value, 2);
				});
			});
	},
	propertyRelative: (state, props) => {
		flatten(state.elements)
			.filter((element) => element.selected)
			.forEach((element) => {
				Object.entries(props.payload).forEach(([key, value]) => {
					element[key] += round(value, 2);
				});
			});
	},
	move: (state, props) => {
		const { position, last_position } = props.payload;
		flatten(state.elements)
			.filter((element) => element.selected)
			.forEach((element) => Elements[element.type].move(element, position, last_position));
	},
	select: (state, props) => {
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
	deleteSelected: (state) => {
		forEachElement(state.elements, (element, i, elements) => {
			if (element.selected === true) elements.splice(i, 1);
		});
	},
	hover: (state, props) => {
		state.elements.find((element) => element.id === props.payload.id).hover = true;
	},
	unhover: (state, props) => {
		state.elements.find((element) => element.id === props.payload.id).hover = false;
	},
	resize: (state, props) => {
		const { id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		selected.forEach((element) => Elements[element.type].resize(element, position, last_position));
	},
	rotate: (state, props) => {
		const { user_id, id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		const target = flatten(state.elements).find((element) => id === element.id);

		const center = Elements[target.type].center(target);

		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

		selected.forEach((element) => Elements[element.type].rotate(element, rotation));

		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		cursor.rotation += rotation;
	},
	stretch: (state, props) => {
		const { id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		selected.forEach((element) => Elements[element.type].stretch(element, position, last_position));
	},
};

const round = (number, decimals) => Math.round(number * 10 ** decimals) / 10 ** decimals;
