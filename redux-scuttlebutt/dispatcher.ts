import * as Scuttlebutt from 'scuttlebutt-vector';

import orderedHistory from './ordered-history';

import getDelayedDispatch from './get-delayed-dispatch';

import { UPDATE_ACTION, META_TIMESTAMP, META_SOURCE } from './constants';

// ignore action types beginning with @
// by default just pass through missing types (redux will blow up later)
export function isGossipType(type = '') {
	return type.slice(0, 1) !== '@';
}

const defaultOptions = {
	customDispatch: getDelayedDispatch,
	isGossipType: isGossipType,
	verifyAsync: undefined,
	signAsync: undefined,
};

const ScuttlebuttClass = Scuttlebutt.default ?? Scuttlebutt;

export default class Dispatcher extends ScuttlebuttClass {
	options;
	_customDispatch;
	_isGossipType;
	_verifyAsync;
	_signAsync;
	_reduxDispatch;
	_reduxGetState;
	_historyReducer;
	constructor(options) {
		super();

		this.options = { ...defaultOptions, ...options };

		this._customDispatch = this.options.customDispatch && this.options.customDispatch(this);

		this._isGossipType = this.options.isGossipType;

		this._verifyAsync = this.options.verifyAsync;
		this._signAsync = this.options.signAsync;

		// redux methods to wrap
		this._reduxDispatch = () => {
			throw new Error('Are you sure you called wrapDispatch?');
		};
		this._reduxGetState = () => {
			// throw new Error('Are you sure you called wrapGetState?')
			// this must return a default state for the very first history call,
			// before .wrapGetState has been applied in the store enhancer.
			return [];
		};
	}

	// wraps the redux dispatch
	wrapDispatch(dispatch) {
		this._reduxDispatch = dispatch;

		return (action) => {
			// apply this action to our scuttlebutt model (and send to peers). It
			// will dispatch, taking care of the the appropriate time ordering
			if (this._isGossipType(action.type)) {
				this.localUpdate(action);
			} else {
				return dispatch(action);
			}
		};
	}

	// wraps getState to the state within orderedHistory
	wrapGetState(getState) {
		this._reduxGetState = getState;
		return () => orderedHistory.getState(getState());
	}

	// wraps the initial state, if any, into the first snapshot
	wrapInitialState(initialState) {
		return orderedHistory.getInitialState(initialState);
	}

	// rewinds history when it changes
	wrapReducer(reducer) {
		this._historyReducer = orderedHistory.reducer(reducer);

		// wrap the root reducer to track history and rewind occasionally
		return (currentState, action) => {
			return this._historyReducer(currentState, action);
		};
	}

	// Apply update (action) to our store
	// implemented for scuttlebutt class
	applyUpdate(update) {
		const [action, timestamp, source] = update;
		// copy the object so we can modify its properties later
		const local_action = { meta: {}, ...action };

		const dispatch = (shouldApply) => {
			if (!shouldApply) {
				return;
			} else if (this._customDispatch) {
				this._customDispatch(local_action);
			} else {
				this._reduxDispatch(local_action);
			}
		};

		// add our metadata to the action as non-enumerable properties. This is so
		// they won't be serialized into JSON when sent over the network to peers in
		// this.history(), and can be added back by other peers as they receive
		// them
		Object.defineProperty(local_action.meta, META_TIMESTAMP, {
			enumerable: false, // false - David
			value: timestamp,
		});

		Object.defineProperty(local_action.meta, META_SOURCE, {
			enumerable: false, // false - David
			value: source,
		});

		if (this._verifyAsync) {
			this._verifyAsync(dispatch, local_action, this._reduxGetState);
		} else {
			dispatch(true);
		}

		// received message successfully. if false, peers may retry the message.
		return true;
	}

	// reply to gossip with the latest timestamps for the sources we've seen
	// implemented for scuttlebutt class
	history(sources) {
		// our state (updates[]) has a similar shape to scuttlebutt's own updates.
		return this._reduxGetState()
			.filter((update) => update[UPDATE_ACTION] && this._isGossipType(update[UPDATE_ACTION].type) && Scuttlebutt.filter(update, sources)) // scuttlebutt only wants ACTION, TIMESTAMP, SOURCE, and not: SNAPSHOT
			.map((update) => update.slice(0, 3));
	}

	// apply an update locally
	// we should ensure we don't send objects which will explode JSON.parse here
	// implemented over scuttlebutt class
	localUpdate(action) {
		if (this._signAsync) {
			this._signAsync(super.localUpdate.bind(this), action, this._reduxGetState);
		} else {
			super.localUpdate(action);
		}
	}
}
