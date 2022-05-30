import { createStore } from 'redux';
import { createSlice } from '@reduxjs/toolkit';
import reducers from '../reducers/reducers';
import initial_state from '../redux/initial-state';

export default function snapshot(actions) {
	const slice = createSlice({
		name: 'action',
		initialState: initial_state,
		reducers: reducers,
	});

	const clone = createStore(slice.reducer, initial_state);

	actions.forEach((action) => {
		if (!action.type.startsWith('action')) return;
		const type = action.type.split('/').pop();

		try {
			clone.dispatch(slice.actions[type](action.payload));
		} catch (error) {
			console.error(error, type);
		}
	});

	return clone.getState();
}
