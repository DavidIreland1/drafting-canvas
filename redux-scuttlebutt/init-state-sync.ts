import * as Primus from 'primus';
import Dispatcher from './dispatcher';

import * as Rooms from 'primus-rooms';

const defaultOptions = {
	getStatistics: getStatistics,
	primusOptions: {},
};

// import { save, load } from '../server/database/local';
import { save, load } from '../server/database/firestore';

import snapshot from './snapshot';
import { createStore } from 'redux';

const documents = {};
const rooms = {}; // { spark_id: room_id/canvas_id }
const users = {}; // { spark_id: user }

export default function initStateSync(server, options = { primusOptions: {} }) {
	options = Object.assign(defaultOptions, options);

	const PrimusClass = Primus.default ?? Primus;

	const primus = new PrimusClass(server, options.primusOptions);
	primus.plugin('rooms', Rooms);

	// const onStatistic = options.getStatistics();

	primus.on('connection', (spark) => {
		spark.on('data', (data) => {
			if (data.action === 'join') {
				rooms[spark.id] = data.room;
				users[spark.id] = data.user;
				if (!documents[rooms[spark.id]]) documents[rooms[spark.id]] = openDocument(rooms[spark.id]);

				console.log('adding user: ', JSON.stringify(users[spark.id]), ' to room: ', rooms[spark.id]);

				addUser(spark, rooms[spark.id], users[spark.id]);
			} else if (data.action === 'leave') {
				removeUser(spark, rooms[spark.id], users[spark.id]);
			} else {
				documents[rooms[spark.id]].streams[spark.id].write(data);
			}
		});
	});

	// Seems to be deleting / saving too often
	primus.on('disconnection', (spark) => {
		removeUser(spark, rooms[spark.id], users[spark.id]);
	});
}

function openDocument(room) {
	const gossip = new Dispatcher({});

	console.log('Loading room: ', room);

	const { store, dispatch, getState } = connectRedux(gossip, undefined);

	load(room).then((document_state) => {
		if (document_state) {
			console.log('Loaded last state for room: ', room);
			dispatch({
				type: 'action/overwrite',
				payload: {
					state: document_state,
				},
			});
		}
	});

	return {
		gossip,
		store,
		dispatch,
		getState,
		streams: {},
	};
}

function addUser(spark, room, user) {
	documents[rooms[spark.id]].dispatch({ type: 'action/addUser', payload: user });

	spark.join(room, () => spark.room(room).write({ action: 'info', room: spark.id + ' joined room ' + room }));

	// Each connection needs it's own stream
	documents[room].streams[spark.id] = documents[room].gossip.createStream();

	documents[room].streams[spark.id].on('data', function (data) {
		spark.write(data);
	});

	documents[room].streams[spark.id].on('error', function (error) {
		spark.leave(room);
		console.log('[io]', spark.id, 'ERROR:', error);
		spark.end('Disconnecting due to error', { reconnect: true });
	});
}

function removeUser(spark, room, user) {
	console.log('remove user: ', spark.id, ' from: ', room);
	if (!documents[room]) return;

	documents[room].dispatch({ type: 'action/removeUser', payload: user });

	delete documents[room].streams[spark.id];
	delete rooms[spark.id];
	delete users[spark.id];

	const num_streams = Object.keys(documents[room].streams).length;
	if (num_streams === 0) {
		const snap = snapshot(documents[room].getState());
		console.log('Saving Room: ', room);
		save(room, { elements: snap.elements, page: snap.page });
		delete documents[room];
	}
}

function connectRedux(gossip, initial_state) {
	const reducer = function reducer() {
		const state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		const action = arguments[1];

		// Filter out the actions we don't want to save
		if (action.type.endsWith('cursor') || action.type.endsWith('hoverOnly') || action.type.endsWith('INIT')) {
			return state;
		}
		return state.concat(action);
	};

	const store = createStore(gossip.wrapReducer(reducer), initial_state);
	const dispatch = gossip.wrapDispatch(store.dispatch);
	const getState = gossip.wrapGetState(store.getState);

	// other things we might want to do ->
	// store.subscribe(render)
	// setInterval(function () { dispatch({ type: 'TICK' }) }, 1000)

	return { store, dispatch, getState };
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// giv me some space

function getStatistics() {
	const statistics = {};

	let statisticsDirty = true;

	// prime statistics for when spark.id is undefined, presumably server messages
	// statistics[undefined] = {
	// 	recv: 0,
	// 	sent: 0,
	// 	s: 'other',
	// };

	setInterval(function () {
		if (!statisticsDirty) return;

		statisticsDirty = false;

		/*
		// full client statistics
		console.log('# ' + (new Date()) + '')
		for (const spark in statistics) {
		  console.log(`${spark}: ${statistics[spark].recv} recv ${statistics[spark].sent} sent (${statistics[spark].s})`)
		}
		*/

		// basic statistics
		console.log(
			[
				new Date().toLocaleString('en-AU'),
				': ',
				(function () {
					let recv = 0,
						sent = 0,
						connected = 0,
						disconnected = 0,
						other = 0;
					for (let spark in statistics) {
						recv += statistics[spark].recv;
						sent += statistics[spark].sent;

						if (statistics[spark].s === 'connected') connected++;
						else if (statistics[spark].s === 'disconnected') disconnected++;
						else other++;
					}

					return 'recv ' + recv + ', sent ' + sent + ', (' + connected + ' \uD83C\uDF0F, ' + disconnected + ' \uD83D\uDD15, ' + other + ' \uD83D\uDC65)';
				})(),
			].join('')
		);
	}, 10000); // max 6/minute

	return function (source, event, extra) {
		statisticsDirty = true;
		if (event === 'connect') {
			statistics[source] = {
				recv: 0,
				sent: 0,
				s: 'connected',
			};
		} else if (event === 'disconnect') {
			statistics[source] = {
				recv: 0,
				sent: 0,
				s: 'disconnected',
			};
		} else if (event === 'error') {
			statistics[source] = {
				recv: 0,
				sent: 0,
				s: 'error',
				err: extra,
			};
		} else if (event === 'recv' || event === 'sent') {
			statistics[source][event]++;
		}
	};
}
