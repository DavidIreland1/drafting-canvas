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

if (typeof window !== 'undefined') {
	Primus = (window as any).Primus;
}

export default function makeStore(room) {
	const store = createStore(
		undoable(slice.reducer, { filter: filterActions, groupBy: groupActions }),
		{
			past: [],
			present: initial_state,
			future: [],
		},
		typeof Primus !== 'undefined' && typeof room !== 'undefined'
			? (scuttlebutt({
					primus: Primus,
					uri: window.location.origin,
					room: room,
			  }) as any)
			: undefined
	);

	if (typeof window !== 'undefined') {
		(window as any).store = store;
	}

	return store;
}

// export type RootState = ReturnType<typeof store.getState>;
export type RootState = any;
