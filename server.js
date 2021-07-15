// server.js
const dispatcher = require('redux-scuttlebutt/lib/server').default;
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const fs = require('fs');
var os = require('os');

const Primus = require('./node_modules/redux-scuttlebutt/lib/primus.js');
const scuttlebutt = require('redux-scuttlebutt');

// const reducers = require('./reducers/index.js');

// console.log(reducers);

app.prepare().then(() => {
	const server = createServer((req, res) => {
		// Be sure to pass `true` as the second argument to `url.parse`.
		// This tells it to parse the query portion of the URL.
		const parsedUrl = parse(req.url, true);
		const { pathname, query } = parsedUrl;

		if (pathname === '/a') {
			app.render(req, res, '/a', query);
		} else if (pathname === '/b') {
			app.render(req, res, '/b', query);
		} else {
			handle(req, res, parsedUrl);
		}
	}).listen(3000, (err) => {
		if (err) throw err;
		console.log('> Ready on http://localhost:3000');
	});

	const { primusServer, store, dispatch, getState } = dispatcher(server);
	// primusServer.save(__dirname + '/primus.js');

	let max = 0;
	store.subscribe(() => {
		// if (max > 0) return;
		max++;
		// const state = store.getState();
		const state = getState();
		console.log(state.length, JSON.stringify(state).length);
		fs.writeFile('store.json', JSON.stringify(state, null, '\t'), 'utf8', () => {});
	});

	// setTimeout(() => {
	// 	const state = require('./store.json');

	// 	state.forEach((element) => {
	// 		dispatch(element);
	// 	});
	// }, 4000);
});

// And then, to read it...
// myJson = require('./filename.json');

const initialState = [
	{
		// meta: {},
		type: 'counter/overwrite',
		payload: {
			state: {
				views: [
					{
						id: '123',
						x: 263.18552166205484,
						y: 261.25855841557444,
						scale: 0.531336927285965,
					},
				],
				cursors: [
					{
						id: '123',
						label: 'David',
						x: 2468.2469088622424,
						y: 330.10634604364077,
						rotation: 0,
						type: 'select',
					},
					{
						id: '234',
						label: 'Irene',
						x: 100,
						y: 100,
						rotation: 0,
						type: 'select',
					},
				],
				elements: [
					{
						id: '35674',
						type: 'circle',
						selected: false,
						hover: false,
						x: 100,
						y: 100,
						rotation: 0,
						color: 'red',
						radius: 60,
						start_angle: 0,
						end_angle: 6.283185307179586,
					},
					{
						id: '3567422',
						type: 'rectangle',
						selected: false,
						hover: false,
						x: 300,
						y: 300,
						rotation: 0,
						color: 'red',
						width: 60,
						height: 120,
					},
					{
						id: '3457',
						type: 'group',
						selected: false,
						hover: false,
						rotation: 0,
						elements: [
							{
								type: 'ellipse',
								selected: false,
								hover: false,
								x: 100,
								y: 100,
								color: 'black',
								radius_x: 60,
								radius_y: 80,
								rotation: 0,
								start_angle: 0,
								end_angle: 6.283185307179586,
							},
							{
								type: 'ellipse',
								selected: false,
								hover: false,
								x: 200,
								y: 200,
								color: 'black',
								radius_x: 60,
								radius_y: 80,
								rotation: 0,
								start_angle: 0,
								end_angle: 6.283185307179586,
							},
						],
					},
					{
						id: '67484',
						type: 'ellipse',
						selected: false,
						hover: false,
						x: 1500,
						y: 1500,
						color: 'red',
						radius_x: 60,
						radius_y: 80,
						rotation: 0,
						start_angle: 0,
						end_angle: 6.283185307179586,
					},
					{
						id: '4678',
						type: 'ellipse',
						selected: false,
						hover: false,
						x: 739.2250888817405,
						y: 692.7766378950408,
						color: 'red',
						radius_x: 60,
						radius_y: 80,
						rotation: 0,
						start_angle: 0,
						end_angle: 6.283185307179586,
					},
					{
						id: '3567',
						type: 'ellipse',
						selected: false,
						hover: false,
						x: 1500,
						y: 100,
						color: 'red',
						radius_x: 60,
						radius_y: 80,
						rotation: 0,
						start_angle: 0,
						end_angle: 6.283185307179586,
					},
					{
						id: '8764',
						type: 'ellipse',
						selected: false,
						hover: false,
						x: 524,
						y: 1200,
						color: 'red',
						radius_x: 60,
						radius_y: 120,
						rotation: 0,
						start_angle: 0,
						end_angle: 6.283185307179586,
					},
				],
			},
		},
	},
];
