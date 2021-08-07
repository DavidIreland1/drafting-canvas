export default {
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
};
