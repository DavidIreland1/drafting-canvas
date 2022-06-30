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

const is_dev = process.env.NODE_ENV !== 'production';

async function initServer() {
	console.log('Initializing server in mode: ', is_dev ? 'development' : 'production');
	if (is_dev) {
		const app = next({ dev: process.env.NODE_ENV !== 'production' });
		const handle = app.getRequestHandler();
		await app.prepare();

		return createServer((req, res) => {
			const url = parse(req.url, true);
			handle(req, res, url);
		});
	} else {
		return createServer((req, res) => {
			res.writeHead(200, { 'Content-Type': 'text/plain' });
			res.write('Drafting Canvas State Sync Production Server Can Only Be Used For Web Socket Connections');
			res.end();
		});
	}
}

async function serve() {
	const server = await initServer();

	server.listen(port, async () => {
		console.log('> Ready on this http://localhost:' + port);
		const initStateSync = (await import('../redux-scuttlebutt/init-state-sync')).default;
		initStateSync(server);
	});
}

serve();
