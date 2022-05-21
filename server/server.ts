import initStateSync from '../redux-scuttlebutt/init-state-sync';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// var log = console.log;
// console.log = function () {
// 	log.apply(console, arguments);
// 	console.trace();
// };

// import Primus from './node_modules/redux-scuttlebutt/lib/primus.js';

const port = process.env.PORT || 8080;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = createServer((req, res) => {
		// const url = new URL(req.url, req.protocol + '://' + req.headers.host + '/');
		const url = parse(req.url, true);
		handle(req, res, url);
	}).listen(port, () => {
		console.log('> Ready on this http://localhost:' + port);
	});

	initStateSync(server);
});
