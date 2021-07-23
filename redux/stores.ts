import Settings from './../components/settings';
import { createStore } from 'redux';

import { slice } from '../reducers/actions';

import scuttlebutt from 'redux-scuttlebutt';
import Primus from './../node_modules/redux-scuttlebutt/lib/primus';

let initial_state = {
	views: [{ id: Settings.user_id, x: 0, y: 0, scale: 1 }],
	cursors: [
		{ id: Settings.user_id, label: Settings.user_name, x: 0, y: 0, rotation: 0, type: 'none' },
		{ id: '234', label: 'Irene', x: 100, y: 100, rotation: 0, type: 'none' },
	],
	elements: [],
};
// initial_state = getPage();

// const store = createStore(slice.reducer, initial_state, typeof Primus !== 'undefined' ? scuttlebutt({ primus: Primus }) : undefined);

export default {
	views: createStore(slice.reducer, initial_state.views),
	cursors: createStore(slice.reducer, initial_state.cursors),
	// elements: createStore(slice.reducer, initial_state.elements),
	elements: createStore(slice.reducer, initial_state.elements, typeof Primus !== 'undefined' ? scuttlebutt({ primus: Primus }) : undefined),
};
