import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// const log = console.log;
// console.log = function () {
// 	log.apply(console, arguments);
// 	console.trace();
// };

// import Primus from './node_modules/redux-scuttlebutt/lib/primus.js';p
const port = 8080;

async function server() {
	let app;
	try {
		app = next({ dev: process.env.NODE_ENV !== 'production' });
	} catch (error) {
		console.log('next init error: ', error);
	}
	const handle = app.getRequestHandler();

	try {
		await app.prepare();
	} catch (error) {
		console.log('prepare error: ', error);
	}

	let server;

	try {
		server = createServer((req, res) => {
			const url = parse(req.url, true);
			handle(req, res, url);
		});
	} catch (error) {
		console.log('create server error: ', error);
	}

	server.listen(port, async () => {
		console.log('> Ready on this http://localhost:' + port);
		const initStateSync = (await import('../redux-scuttlebutt/init-state-sync')).default;
		initStateSync(server);
	});
}

server();
