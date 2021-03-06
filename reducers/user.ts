const user = {
	addUser: (state, props) => {
		const { id, label, color } = props.payload;
		state.views.push({ id: id, label: label, x: 0, y: 0, scale: 3 });
		state.cursors.push({ id: id, label: label, color: color, x: 0, y: 0, rotation: 0, type: 'select', mode: 'edit', visible: false, pressed: false });
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
		const { id } = props.payload;
		state.views = state.views.filter((view) => view.id !== id);
		state.cursors = state.cursors.filter((view) => view.id !== id);
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
		cursor.id = user_id;
		Object.entries(props.payload).forEach(([key, value]) => value !== undefined && (cursor[key] = value));
	},
};

export default user;
