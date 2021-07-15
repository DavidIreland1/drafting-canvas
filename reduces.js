import Elements from './../components/elements/elements';

export default {
	overwrite: (state, props) => {
		while (state.length) state.pop();
		props.payload.state.forEach((element) => state.push(element));
	},
	cursor: (state, props) => {
		const { id, x, y, rotation, type } = props.payload;
		const cursor = state.find((cursor) => id === cursor.id);
		if (x) cursor.x = x;
		if (y) cursor.y = y;
		if (rotation) cursor.rotation = rotation;
		if (type) cursor.type = type;
	},
	view: (state, props) => {
		const { id, delta_x, delta_y, delta_scale } = props.payload;
		const view = state.find((view) => id === view.id);
		if (delta_x) view.x += delta_x;
		if (delta_y) view.y += delta_y;
		if (delta_scale) view.scale += delta_scale;
	},
	move: (state, props) => {
		const { position, last_position } = props.payload;
		state.filter((element) => element.selected).forEach((element) => Elements[element.type].move(element, position, last_position));
	},
	select: (state, props) => {
		const element = state.find((element) => element.id === props.payload.id);
		if (element) element.selected = true;
	},
	unselect: (state) => {
		state.forEach((element) => (element.selected = false));
	},
	hover: (state, props) => {
		state.find((element) => element.id === props.payload.id).hover = true;
	},
	unhover: (state, props) => {
		state.find((element) => element.id === props.payload.id).hover = false;
	},
	resize: (state, props) => {
		const { id, position, last_position } = props.payload;

		const selected = state.filter((element) => element.selected);

		const target = state.find((element) => id === element.id);

		const center = Elements[target.type].center(target);

		const direction_x = Math.sign(last_position.x - center.x);
		const direction_y = Math.sign(last_position.y - center.y);

		selected.forEach((element) => Elements[element.type].resize(element, position, last_position, direction_x, direction_y));
	},
	rotate: (state, props) => {
		const { id, position, last_position } = props.payload;

		const selected = state.filter((element) => element.selected);

		const target = state.find((element) => id === element.id);

		const center = Elements[target.type].center(target);

		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

		selected.forEach((element) => Elements[element.type].rotate(element, rotation));

		const cursor = state.find((cursor) => '123' === cursor.id);
		cursor.rotation += rotation;
	},
};
