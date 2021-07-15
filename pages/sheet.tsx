import { useEffect } from 'react';

import Canvas from '../components/canvas/canvas';
import Toolbar from '../components/toolbar';
import getPage from '../state/dev';

import { createStore } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import reducers from './../reducers/reducers';

import scuttlebutt from 'redux-scuttlebutt';

// import Primus from './../node_modules/redux-scuttlebutt/lib/primus';

export default function Sheet() {
	const id = '123';
	const name = 'David';

	let initial_state = {
		views: [{ id: id, x: 0, y: 0, scale: 1 }],
		cursors: [
			{ id: id, label: name, x: 0, y: 0, rotation: 0, type: 'none' },
			{ id: '234', label: 'Irene', x: 100, y: 100, rotation: 0, type: 'none' },
		],
		elements: [],
	};
	// initial_state = getPage();

	const slice = createSlice({
		name: 'counter',
		initialState: [],
		reducers: reducers,
	});

	// const store = createStore(slice.reducer, initial_state, typeof Primus !== 'undefined' ? scuttlebutt({ primus: Primus }) : undefined);

	const stores = {
		views: createStore(slice.reducer, initial_state.views),
		cursors: createStore(slice.reducer, initial_state.cursors),
		elements: createStore(slice.reducer, initial_state.elements, typeof Primus !== 'undefined' ? scuttlebutt({ primus: Primus }) : undefined),
	};

	stores.elements.subscribe(() => {
		window.localStorage.setItem('elements', JSON.stringify(stores.elements.getState()));
	});

	useEffect(() => {
		window.addEventListener('keydown', (event) => {
			if (event.metaKey && event.key === 'b') {
				let pages = getPage();
				stores.elements.dispatch(slice.actions.overwrite({ state: pages.elements }));
			}
		});
	}, []);

	return (
		<div id="cols">
			<Toolbar />
			<Canvas id={id} store={stores} actions={slice.actions} />

			<style jsx>{`
				#cols {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content;
				}
			`}</style>
		</div>
	);
}
