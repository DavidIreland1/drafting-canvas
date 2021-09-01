'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const fs = require('fs');
const Primus = require('primus');
const Dispatcher = require('./dispatcher').default;

const Rooms = require('primus-rooms');

const INFILE = process.env['INFILE'];
const OUTFILE = process.env['OUTFILE'];
const REMOTE_SB = process.env['REMOTE_SB'];

const defaultOptions = {
	getStatistics: getStatistics,
	primusOptions: {},
	dispatcherOptions: {},
};

let documents = {};
function openDocument(room, options) {
	const gossip = new Dispatcher(options.dispatcherOptions);

	const document_state = load(room);

	const { store, dispatch, getState } = connectRedux(gossip, undefined);

	if (document_state) {
		document_state.forEach((action) => {
			dispatch(action);
		});
	}

	return {
		gossip,
		store,
		dispatch,
		getState,
		streams: {},
	};
}

exports.default = function scuttlebuttServer(server, options) {
	options = Object.assign(defaultOptions, options);

	const primus = new Primus(server, options.primusOptions);
	primus.plugin('rooms', Rooms);

	// const onStatistic = options.getStatistics();

	primus.on('connection', function (spark) {
		// const stream = gossip.createStream();
		// This works console.log('[io] connection', spark.address, spark.id);
		// onStatistic(spark.id, 'connect');
		let room;

		spark.on('data', function recv(data) {
			if (data.action === 'admin') {
				room = data.room;

				spark.join(room, () => spark.room(room).write({ action: 'admin', room: spark.id + ' joined room ' + data.room }));

				if (!documents[room]) documents[room] = openDocument(room, options);

				// Each connection needs it's own stream
				documents[room].streams[spark.id] = documents[room].gossip.createStream();

				documents[room].streams[spark.id].on('data', function (data) {
					// spark.room(room).write(data);
					spark.write(data); // Might be sending this to all clients but line above breaks
				});

				documents[room].streams[spark.id].on('error', function (error) {
					spark.leave(room);
					console.log('[io]', spark.id, 'ERROR:', error);
					spark.end('Disconnecting due to error', { reconnect: true });
				});
			} else {
				// onStatistic(spark.id, 'recv');
				// stream.write(data);

				// Send data out to stream
				documents[room].streams[spark.id].write(data);
			}

			// console.log('[io]', spark.id, '<-', data);
		});

		// Seems to be deleteing / saving too often
		primus.on('disconnection', function (spark) {
			if (!documents[room]) return;
			if (documents[room].streams[spark.id]) delete documents[room].streams[spark.id];

			const num_streams = Object.keys(documents[room].streams).length;
			if (num_streams === 0) {
				save(room, documents[room].getState());
				delete documents[room];
			}

			// console.log(, spark.id);

			// This works console.log('[io] disconnect', spark.address, spark.id);
			// onStatistic(spark.id, 'disconnect');
			// in case you don't want to track zombie connections
			// delete statistics[spark.id]
		});
	});

	// return { primus, store, dispatch, getState };
};

function connectRedux(gossip, initial_state) {
	const Redux = require('redux');

	const reducer = function reducer() {
		const state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		const action = arguments[1];

		// Filter out the actions we don't want to save
		if (action.type.endsWith('cursor') || action.type.endsWith('hoverOnly')) {
			// console.log(action.type);
			return state;
		}
		return state.concat(action);
	};

	const store = Redux.createStore(gossip.wrapReducer(reducer), initial_state);
	const dispatch = gossip.wrapDispatch(store.dispatch);
	const getState = gossip.wrapGetState(store.getState);

	// other things we might want to do ->
	// store.subscribe(render)
	// setInterval(function () { dispatch({ type: 'TICK' }) }, 1000)

	return { store, dispatch, getState };
}

function save(name, data) {
	fs.writeFile('./datastate/' + name + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {});
}

function load(name) {
	try {
		return JSON.parse(fs.readFileSync('./datastate/' + name + '.json'));
	} catch (error) {
		return undefined;
	}
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
	statistics[undefined] = {
		recv: 0,
		sent: 0,
		s: 'other',
	};

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
