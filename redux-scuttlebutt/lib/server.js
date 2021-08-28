'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
});

const fs = require('fs');
const Primus = require('primus');
const Dispatcher = require('./dispatcher').default;

const Rooms = require('primus-rooms');

const INFILE = process.env['INFILE'];
const OUTFILE = process.env['OUTFILE'];
const REMOTE_SB = process.env['REMOTE_SB'];

const defaultOptions = {
	connectRedux: connectRedux,
	getStatistics: getStatistics,
	primusOptions: {},
	dispatcherOptions: {},
};

exports.default = function scuttlebuttServer(server, options) {
	options = Object.assign(defaultOptions, options);

	const primus = new Primus(server, options.primusOptions);
	primus.plugin('rooms', Rooms);

	const gossip = new Dispatcher(options.dispatcherOptions);
	const onStatistic = options.getStatistics();

	// primus.save(__dirname + '/primus.js');
	// connect dispatcher to redux
	const { store, dispatch, getState } = options.connectRedux(gossip);

	// read actions from file
	if (INFILE) {
		const gossipWriteSteam = gossip.createWriteStream();
		fs.createReadStream(INFILE).pipe(gossipWriteSteam);

		console.log('📼  Reading from ' + INFILE);
	}

	// stream actions to file -- this will include all actions in INFILE
	if (OUTFILE) {
		const gossipReadSteam = gossip.createReadStream();

		// For some reason, we're not getting any 'sync' events from Dispatcher,
		// so we'll listen for it in the datastream and write to disk after it
		// <https://github.com/dominictarr/scuttlebutt#persistence>

		gossipReadSteam.on('data', function (data) {
			if (data === '"SYNC"\n') {
				console.log('📼  Writing to ' + OUTFILE);
				gossipReadSteam.pipe(fs.createWriteStream(OUTFILE));
			}
		});

		// this doesn't fire.
		gossip.on('sync', function () {
			console.log('📼  [NATURAL SYNC] Writing to ' + OUTFILE);
			gossipReadSteam.pipe(fs.createWriteStream(OUTFILE));
		});

		console.log('📼  Ready to write to ' + OUTFILE);
	}

	// connect to remote redux-scuttlebutt instance
	if (REMOTE_SB) {
		const remoteStream = gossip.createStream();
		const remoteClient = new primus.Socket(REMOTE_SB);

		console.log('💡  connecting to remote ' + REMOTE_SB);

		remoteClient.pipe(remoteStream).pipe(remoteClient);

		onStatistic('REMOTE_SB', 'connect');

		remoteClient.on('data', function recv(data) {
			// console.log('[io]', 'REMOTE_SB', '<-', data);
			onStatistic('REMOTE_SB', 'recv');
		});

		remoteStream.on('data', function (data) {
			// console.log('[io]', 'REMOTE_SB' || 'origin', '->', data);
			onStatistic('REMOTE_SB', 'sent');
		});

		remoteStream.on('error', function (error) {
			onStatistic('REMOTE_SB', 'error', error);
			console.log('[io]', 'REMOTE_SB', 'ERROR:', error);
			remoteClient.end('Disconnecting due to error', { reconnect: true });
		});
	}

	primus.on('connection', function (spark) {
		const stream = gossip.createStream();

		// This works console.log('[io] connection', spark.address, spark.id);
		onStatistic(spark.id, 'connect');

		spark.on('data', function recv(data) {
			console.log(data);
			// if (room !== 'me') {
			// 	return spark.join(room, () => console.log('joined room %s', room));
			// }

			// console.log('[io]', spark.id, '<-', data);
			onStatistic(spark.id, 'recv');
			stream.write(data);
		});

		stream.on('data', function (data) {
			// console.log('[io]', spark.id || 'origin', '->', data);
			onStatistic(spark.id, 'sent');
			spark.write(data);
		});

		stream.on('error', function (error) {
			onStatistic(spark.id, 'error', error);
			console.log('[io]', spark.id, 'ERROR:', error);
			spark.end('Disconnecting due to error', { reconnect: true });
		});
	});

	primus.on('disconnection', function (spark) {
		// This works console.log('[io] disconnect', spark.address, spark.id);
		onStatistic(spark.id, 'disconnect');
		// in case you don't want to track zombie connections
		// delete statistics[spark.id]
	});

	return { primus, store, dispatch, getState };
};

function connectRedux(gossip) {
	const Redux = require('redux');

	const reducer = function reducer() {
		const state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		const action = arguments[1];
		return state.concat(action);
	};

	const store = Redux.createStore(gossip.wrapReducer(reducer), undefined);
	const dispatch = gossip.wrapDispatch(store.dispatch);
	const getState = gossip.wrapGetState(store.getState);

	// other things we might want to do ->
	// store.subscribe(render)
	// setInterval(function () { dispatch({ type: 'TICK' }) }, 1000)

	return { store, dispatch, getState };
}

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

	return () => {};
	// return function (source, event, extra) {
	// 	statisticsDirty = true;
	// 	if (event === 'connect') {
	// 		statistics[source] = {
	// 			recv: 0,
	// 			sent: 0,
	// 			s: 'connected',
	// 		};
	// 	} else if (event === 'disconnect') {
	// 		statistics[source] = {
	// 			recv: 0,
	// 			sent: 0,
	// 			s: 'disconnected',
	// 		};
	// 	} else if (event === 'error') {
	// 		statistics[source] = {
	// 			recv: 0,
	// 			sent: 0,
	// 			s: 'error',
	// 			err: extra,
	// 		};
	// 	} else if (event === 'recv' || event === 'sent') {
	// 		statistics[source][event]++;
	// 	}
	// };
}
