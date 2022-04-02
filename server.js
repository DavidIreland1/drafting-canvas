// server.js
const initStateSync = require('./redux-scuttlebutt/lib/server').default;

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

// var log = console.log;
// console.log = function () {
// 	log.apply(console, arguments);
// 	console.trace();
// };

// const Primus = require('./node_modules/redux-scuttlebutt/lib/primus.js');
// const scuttlebutt = require('redux-scuttlebutt').default;

app.prepare().then(() => {
	const server = createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;

		handle(req, res, parsedUrl);

		// if (pathname.startsWith('/page/')) {
		// 	const page_id = pathname.split('/')[2];
		// 	res.setHeader('Content-Type', 'application/json');
		// 	res.end(JSON.stringify(load(page_id) || initial_state));
		// }
	}).listen(3000, () => {
		console.log('> Ready on http://localhost:3000');
	});

	// initStateSync(server);

	// Apply all changes
	// setTimeout(() => {
	// const state = load('./store.json');
	// state.forEach((action) => {
	// 	dispatch(action);
	// });
	// });

	// Get snapshot of current state
	setInterval(() => {
		// updateSnapshot(getState());
	}, 4000);
});

// const reducers = require('./reducers/reducers.min.js').default;
// const { createStore } = require('redux');
// const { createSlice } = require('@reduxjs/toolkit');

// const initial_state = {
// 	cursors: [],
// 	views: [],
// 	elements: [],
// };

// const slice = createSlice({
// 	name: 'action',
// 	initialState: initial_state,
// 	reducers: reducers,
// });

// const clone = createStore(slice.reducer, {});

// function updateSnapshot() {
// 	actions.forEach((action) => {
// 		if (!action.type.startsWith('counter')) return;
// 		const type = action.type.split('/').pop();
// 		clone.dispatch(slice.actions[type](action.payload));
// 	});
// 	save('222', clone.getState());
// }
