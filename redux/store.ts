import Settings from '../components/settings';
import { createStore } from 'redux';

import { slice } from '../reducers/actions';

import scuttlebutt from 'redux-scuttlebutt';
// import Primus from './../node_modules/redux-scuttlebutt/lib/primus';
// import Primus from 'primus/primus';

import getPage from './../state/dev';

let Primus;
if (typeof window !== 'undefined') Primus = (window as any).Primus;

let initial_state = {
	views: [{ id: Settings.user_id, x: 0, y: 0, scale: 1 }],
	cursors: [
		{ id: Settings.user_id, label: Settings.user_name, x: 0, y: 0, rotation: 0, type: 'none' },
		{ id: '234', label: 'Irene', x: 100, y: 100, rotation: 0, type: 'none' },
	],
	elements: [],
};

// initial_state = getPage();

// export default function initStore(initial_state) {
// 	console.log('create store');
// 	return createStore(slice.reducer, initial_state, typeof Primus !== 'undefined' ? scuttlebutt({ primus: Primus }) : undefined);
// }

export default createStore(slice.reducer, initial_state, typeof Primus !== 'undefined' ? scuttlebutt({ primus: Primus }) : undefined);

// export default createStore(slice.reducer, initial_state);
