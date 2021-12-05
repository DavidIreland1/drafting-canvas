export default {
	overwrite: (state, props) => {
		Object.entries(props.payload.state).forEach(([key, value]) => {
			// if (!state[key] || state[key].length === 0) state[key] = value;

			console.log('creation.ts', key, value);
			if (value !== undefined) state[key] = value;
		});
	},
};
