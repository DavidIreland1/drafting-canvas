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
};
