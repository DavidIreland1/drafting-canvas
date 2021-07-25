import { createSlice } from '@reduxjs/toolkit';

import reducers from './reducers';

export const slice = createSlice({
	name: 'counter',
	initialState: {},
	reducers: reducers,
});

export default slice.actions;
