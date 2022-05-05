import { createStore } from 'redux';
import { slice } from './slice';
// import scuttlebutt from 'redux-scuttlebutt';
import scuttlebutt from '../redux-scuttlebutt/client';

import undoable from 'redux-undo';

// import Primus from './../node_modules/redux-scuttlebutt/lib/primus';
// import Primus from 'primus/primus';

import { filterActions, groupActions } from './undo';
import initial_state from './initial-state';

let Primus;
let room;

if (typeof window !== 'undefined') {
	Primus = (window as any).Primus;
	room = location.pathname.split('/')[1];
}

const store = createStore(
	undoable(slice.reducer, { filter: filterActions, groupBy: groupActions }),
	{
		past: [],
		present: initial_state,
		future: [],
	},
	typeof Primus !== 'undefined'
		? (scuttlebutt({
				primus: Primus,
				uri: 'http://localhost:3001',
				// uri: 'http://ec2-18-190-153-178.us-east-2.compute.amazonaws.com:3000',
				room: room,
		  }) as any)
		: undefined
);

export default store;

export type RootState = ReturnType<typeof store.getState>;

if (typeof window !== 'undefined') {
	(window as any).store = store;
}
