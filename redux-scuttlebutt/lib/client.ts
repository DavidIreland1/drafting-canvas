import Dispatcher from './dispatcher';
import { UPDATE_SNAPSHOT } from './constants';

export { isGossipType } from './dispatcher';
export { META_SOURCE, META_TIMESTAMP, UPDATE_ACTION, UPDATE_TIMESTAMP, UPDATE_SOURCE, UPDATE_SNAPSHOT } from './constants';

import { tool_actions } from './../../reducers/tools';

// Applies default options.
const defaultOptions = {
	uri: typeof window === 'object' && `${window.location.protocol}//${window.location.host}`,
	primusOptions: {},
	primus: typeof window === 'object' && (window as any).Primus,
	dispatcherOptions: {},
};

// Store enhancer
// Wraps createStore to inject our history reducer, wraps dispatch to send and
// receive actions from peers, and FIXME: getState to apparently break everything
//
export default function scuttlebutt(options) {
	options = { ...defaultOptions, ...options };

	return (createStore) => {
		// is it more efficient to store previous states, or replay a bunch of
		// previous actions? (until we have COMMIT checkpointing, the former)
		let dispatcher = new Dispatcher(options.dispatcherOptions);

		dispatcher = connectGossip(dispatcher, options.uri, options.primusOptions, options.primus, options.room);

		return (reducer, initialState, enhancer) => {
			const store = createStore(
				dispatcher.wrapReducer(reducer),
				dispatcher.wrapInitialState(initialState), // preloaded state is the earliest snapshot
				enhancer
			);

			return {
				...store,
				scuttlebutt,
				dispatch: dispatcher.wrapDispatch(store.dispatch),
				getState: dispatcher.wrapGetState(store.getState),
			};
		};
	};
}

// initialise network io
function connectGossip(dispatcher, uri, primusOptions, Primus, room) {
	dispatcher.primus = Primus.connect(uri, primusOptions);

	console.log('[io] connecting...');

	connectStreams(dispatcher.primus, () => dispatcher.createStream(), room);

	return dispatcher;
}

// the internet is a series of tubes
function connectStreams(primus, createStream, room) {
	// would love to do this. it doesn't work:
	// spark.pipe(docStream).pipe(spark)

	let DEBUG_DELAY;
	if (/^#\d+/.test(window.location.hash)) {
		DEBUG_DELAY = parseInt(window.location.hash.substr(1));
		console.debug('delayed connection active', DEBUG_DELAY);
	}

	primus.on('open', () => {
		console.log('[primus] connection open');

		// create fresh stream,
		// discard the old one (hopefullly .destroy()d on 'end')
		const gossip = createStream();

		// Data going out
		gossip.on('data', (data) => {
			// Filter out local only 'tool' actions
			const action = JSON.parse(data);
			if (action.length && action[0].type) {
				const type = action[0].type.split('action/')[1];
				if (tool_actions.includes(type)) return;

				// Stop shareing cursor actions for easier debugging
				// if (type === 'cursor') return;
			}
			primus.write(data);
		});

		primus.write({ action: 'join', room: room });

		// Data coming in
		primus.on('data', (data) => {
			if (!data) return;
			if (data.action === 'info') return;

			gossip.write(data);
		});

		primus.on('end', () => {
			console.log('[primus] ended');
			gossip.end();
			gossip.destroy();
		});

		// store stream events

		gossip.on('error', (error) => {
			console.warn('[gossip] error', error);
			primus.end(undefined, { reconnect: true });
		});

		// handshake header recieved from a new peer. includes their id and clock info
		gossip.on('header', (header) => {
			const { id, clock } = header;
			console.log('[gossip] header', id);
		});
	});

	primus.on('error', (error) => {
		console.log('[primus] error', error);
	});
}

// devToolsStateSanitizer can be applied to the devToolsExtension
// as the stateSanitizer to show correctly the store state instead
// of showing the internal representation of redux-scuttlebutt
export const devToolsStateSanitizer = (state) => state.slice(-1)[0][UPDATE_SNAPSHOT];
