import { createSlice } from '@reduxjs/toolkit';
import reducers from '../reducers/reducers';
import initial_state from './initial-state';

export const slice = createSlice({
	name: 'action',
	initialState: initial_state,
	reducers: reducers,
});

export default slice.actions;
