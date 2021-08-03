import { createSlice } from '@reduxjs/toolkit';

import reducers from './reducers';
import initial_state from './../state/initial';

export const slice = createSlice({
	name: 'counter',
	initialState: initial_state,
	reducers: reducers,
});

export default slice.actions;
