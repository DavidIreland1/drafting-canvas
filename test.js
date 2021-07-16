const fs = require('fs');

const Primus = require('./node_modules/redux-scuttlebutt/lib/primus.js');
const scuttlebutt = require('redux-scuttlebutt').default;
const reducer = require('./reducers/reducer.js').default;

const { createStore } = require('redux');
const { createSlice } = require('@reduxjs/toolkit');

const slice = createSlice({
	name: 'counter',
	initialState: [],
	reducers: reducer,
});

const clone = createStore(slice.reducer, [], scuttlebutt({ primus: Primus }));
// console.log('start');

// clone.subscribe(() => {
// 	console.log('we won');
// 	const state = clone.getState();
// 	save('store.json', state);
// });

function save(name, data) {
	fs.writeFile(name, JSON.stringify(data, null, '\t'), 'utf8', () => {});
}

function load(name) {
	return require(name);
}
