export default {
	overwrite: (state, props) => {
		Object.entries(props.payload.state).forEach(([key, value]) => {
			if (!state[key] || state[key].length === 0) state[key] = value;
		});
	},
	addUser: (state, props) => {
		const { user_id, label, color } = props.payload;
		state.views.push({ id: user_id, label: label, x: 0, y: 0, scale: 1 });
		state.cursors.push({ id: user_id, label: label, color: color, x: 0, y: 0, rotation: 0, type: 'none' });
	},
	removeUser: (state, props) => {
		const { user_id } = props.payload;
		state.views = state.views.filter((view) => view.id !== user_id);
		state.cursors = state.cursors.filter((view) => view.id !== user_id);
	},
};
