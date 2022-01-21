export default {
	addUser: (state, props) => {
		const { user_id, label, color } = props.payload;
		state.views.push({ id: user_id, label: label, x: 1000, y: 1000, scale: 5 });
		state.cursors.push({ id: user_id, label: label, color: color, x: 0, y: 0, rotation: 0, type: 'select', mode: 'edit', visible: false });
	},
	centerView: (state, props) => {
		const { user_id, x, y } = props.payload;
		const view = state.views.find((view) => user_id === view.id);
		if (!view) return; // Not great
		view.x = x;
		view.y = y;
		view.centered = true;
	},
	removeUser: (state, props) => {
		const { user_id } = props.payload;
		state.views = state.views.filter((view) => view.id !== user_id);
		state.cursors = state.cursors.filter((view) => view.id !== user_id);
	},
	view: (state, props) => {
		const { user_id, delta_x, delta_y, delta_scale, cursor_x, cursor_y } = props.payload;
		const view = state.views.find((view) => user_id === view.id);
		if (!view) return; // Not great
		if (delta_x) view.x += delta_x;
		if (delta_y) view.y += delta_y;
		if (delta_scale) view.scale += delta_scale;

		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		if (cursor_x) cursor.x = cursor_x;
		if (cursor_y) cursor.y = cursor_y;
	},
	cursor: (state, props) => {
		const { user_id } = props.payload;
		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		if (!cursor) return; // Not great
		// if (x) cursor.x = x;
		// if (y) cursor.y = y;
		// if (rotation) cursor.rotation = rotation;
		// if (type) cursor.type = type;
		// if (mode) cursor.mode = mode;
		// if (visible) cursor.visible = visible;
		cursor.id = user_id;
		Object.entries(props.payload).forEach(([key, value]) => {
			if (value !== undefined) cursor[key] = value;
		});
	},
};
