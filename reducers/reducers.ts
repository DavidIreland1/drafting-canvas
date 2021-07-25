import Elements, { flatten } from '../components/elements/elements';

export default {
	overwrite: (state, props) => {
		state.cursors = props.payload.state.cursors;
		state.views = props.payload.state.views;
		state.elements = props.payload.state.elements;
	},
	view: (state, props) => {
		const { id, delta_x, delta_y, delta_scale } = props.payload;
		const view = state.views.find((view) => id === view.id);
		if (delta_x) view.x += delta_x;
		if (delta_y) view.y += delta_y;
		if (delta_scale) view.scale += delta_scale;
	},
	cursor: (state, props) => {
		const { id, x, y, rotation, type } = props.payload;
		const cursor = state.cursors.find((cursor) => id === cursor.id);
		if (x) cursor.x = x;
		if (y) cursor.y = y;
		if (rotation) cursor.rotation = rotation;
		if (type) cursor.type = type;
	},
	move: (state, props) => {
		const { position, last_position } = props.payload;
		flatten(state.elements)
			.filter((element) => element.selected)
			.forEach((element) => Elements[element.type].move(element, position, last_position));
	},
	select: (state, props) => {
		const element = flatten(state.elements).find((element) => element.id === props.payload.id);
		if (element) element.selected = true;
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
	hover: (state, props) => {
		state.elements.find((element) => element.id === props.payload.id).hover = true;
	},
	unhover: (state, props) => {
		state.elements.find((element) => element.id === props.payload.id).hover = false;
	},
	resize: (state, props) => {
		const { id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		const target = state.elements.find((element) => id === element.id);

		const center = Elements[target.type].center(target);

		const direction_x = Math.sign(last_position.x - center.x);
		const direction_y = Math.sign(last_position.y - center.y);

		selected.forEach((element) => Elements[element.type].resize(element, position, last_position, direction_x, direction_y));
	},
	rotate: (state, props) => {
		const { user_id, id, position, last_position } = props.payload;

		const selected = state.elements.filter((element) => element.selected);

		const target = state.elements.find((element) => id === element.id);

		const center = Elements[target.type].center(target);

		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

		selected.forEach((element) => Elements[element.type].rotate(element, rotation));

		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		cursor.rotation += rotation;
	},
};
