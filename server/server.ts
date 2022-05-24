import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// const log = console.log;
// console.log = function () {
// 	log.apply(console, arguments);
// 	console.trace();
// };

// import Primus from './node_modules/redux-scuttlebutt/lib/primus.js';
const port = 8080;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = createServer((req, res) => {
		const url = parse(req.url, true);
		handle(req, res, url);
	}).listen(port, async () => {
		console.log('> Ready on this http://localhost:' + port);

		const initStateSync = (await import('../redux-scuttlebutt/init-state-sync')).default;

		initStateSync(server);
	});
});
