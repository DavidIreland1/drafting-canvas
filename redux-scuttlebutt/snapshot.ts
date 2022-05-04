import { createStore } from 'redux';
import toolkit from '@reduxjs/toolkit';
import reducers from '../reducers/reducers';
import initial_state from './../redux/initial-state';

export function snapshot(actions) {
	const slice = toolkit.createSlice({
		name: 'action',
		initialState: initial_state,
		reducers: reducers,
	});

	const clone = createStore(slice.reducer, initial_state);

	actions.forEach((action) => {
		const type = action.type.split('/').pop();
		clone.dispatch(slice.actions[type](action.payload));
	});

	return clone.getState();
}
