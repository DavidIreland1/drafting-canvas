// server.js
import initStateSync from '../redux-scuttlebutt/lib/server.js';

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// var log = console.log;
// console.log = function () {
// 	log.apply(console, arguments);
// 	console.trace();
// };

// import Primus from './node_modules/redux-scuttlebutt/lib/primus.js';

const port = 3001;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		handle(req, res, parsedUrl);
	}).listen(port, () => {
		console.log('> Ready on http://localhost:' + port);
	});

	try {
		initStateSync(server);
	} catch (error) {
		console.trace(error);
	}

	// Get snapshot of current state
	setInterval(() => {
		// updateSnapshot(getState());
	}, 4000);
});
