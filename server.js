// server.js
const dispatcher = require('./redux-scuttlebutt/lib/server').default;

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const fs = require('fs');
// var os = require('os');

const initial_state = {
	cursors: [],
	views: [],
	elements: [],
};

// var log = console.log;
// console.log = function () {
// 	log.apply(console, arguments);
// 	console.trace();
// };

// const Dispatcher = require('./node_modules/redux-scuttlebutt/lib/dispatcher.js').default;

// const Primus = require('./node_modules/redux-scuttlebutt/lib/primus.js');
// const scuttlebutt = require('redux-scuttlebutt').default;
const reducers = require('./reducers/reducers.min.js').default;

const { createStore } = require('redux');
const { createSlice } = require('@reduxjs/toolkit');

app.prepare().then(() => {
	const server = createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;

		if (pathname.startsWith('/page/')) {
			const page_id = pathname.split('/')[2];
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(load(page_id) || initial_state));
		} else {
			handle(req, res, parsedUrl);
		}
	}).listen(3000, () => {
		console.log('> Ready on http://localhost:3000');
	});

	dispatcher(server);

	// primusServer.save(__dirname + '/primus.js');

	// store.subscribe(() => {
	// const state = store.getState();
	// const state2 = getState();
	// console.log(Math.round(process.memoryUsage().heapUsed / 10000000), JSON.stringify(state).length, JSON.stringify(state2).length);
	// });

	// const dispatcher2 = new Dispatcher({});
	// const dispatcher3 = dispatcher2.wrapDispatch(clone.dispatch);

	// Apply all changes
	setTimeout(() => {
		// const state = load('./store.json');
		// state.forEach((action) => {
		// 	dispatch(action);
		// });
	});

	// Get snapshot of current state
	setInterval(() => {
		// updateSnapshot(getState());
	}, 4000);
});

const slice = createSlice({
	name: 'action',
	initialState: initial_state,
	reducers: reducers,
});

const clone = createStore(slice.reducer, {});

function updateSnapshot(actions) {
	actions.forEach((action) => {
		if (!action.type.startsWith('counter')) return;
		const type = action.type.split('/').pop();
		clone.dispatch(slice.actions[type](action.payload));
	});
	save('222', clone.getState());
}

// clone.subscribe(() => {
// 	save('snapshot.json', clone.getState());
// });

function save(name, data) {
	fs.writeFile('./database/' + name + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {});
}

function load(name) {
	if (name.startsWith('test-')) return loadTest(Number(name.slice(5)));
	try {
		return JSON.parse(fs.readFileSync('./database/' + name + '.json'));
	} catch (error) {
		return undefined;
	}
}

function loadTest(n) {
	return {
		id: 'test-' + n,
		label: 'Test Page ' + n,
		views: [{ id: '123', x: 0, y: 0, scale: 1 }],
		cursors: [
			{ id: '123', label: 'Davis', x: 0, y: 0, rotation: 0, type: 'none' },
			{ id: '234', label: 'Irene', x: 100, y: 100, rotation: 0, type: 'none' },
		],
		elements: Array(n)
			.fill()
			.map((element, i, array) => {
				const side = Math.round(Math.sqrt(array.length));
				return {
					id: '35674' + i,
					type: 'circle',
					label: 'circle',
					selected: false,
					hover: false,
					x: (n / side) * (i % side),
					y: (n / side) * Math.floor(i / side),
					fill: [{ color: 'red' }],
					stroke: [{ width: 2, color: 'green' }],
					rotation: 0,
					radius: 5,
					start_angle: 0,
					end_angle: 2 * Math.PI,
					visible: true,
				};
			}),
	};
}
