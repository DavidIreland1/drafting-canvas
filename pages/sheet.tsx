import { useEffect } from 'react';

import Canvas from '../components/canvas';
import Toolbar from '../components/toolbar';

import getPage from '../state/dev';

import { createStore } from 'redux';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import Elements from '../components/canvas/elements/elements';

import scuttlebutt, { devToolsStateSanitizer } from 'redux-scuttlebutt';

import Primus from './../node_modules/redux-scuttlebutt/lib/primus.js';

export default function Sheet() {
	const id = '123';
	const name = 'David';

	const initial_state = {
		views: [{ id: id, x: 0, y: 0, scale: 1 }],
		cursors: [
			{ id: id, label: name, x: 0, y: 0, rotation: 0, type: 'none' },
			{ id: '234', label: name, x: 100, y: 100, rotation: 0, type: 'none' },
		],
		elements: [],
	};

	useEffect(() => {
		// const pages = JSON.parse(window.localStorage.getItem('state'));
		const pages = getPage();

		if (pages)
			store.dispatch(
				slice.actions.overwrite({
					state: pages,
				})
			);
	}, []);

	const pages = getPage();

	const slice = createSlice({
		name: 'counter',
		initialState: initial_state,
		reducers: {
			overwrite: (state, props) => {
				const { views, cursors, elements } = props.payload.state;
				state.views = views;
				state.cursors = cursors;
				state.elements = elements;
			},
			view: (state, props) => {
				const { id, delta_x, delta_y, delta_scale } = props.payload;
				const view = state.views.find((view) => id === view.id);
				if (delta_x) view.x += delta_x;
				if (delta_y) view.y += delta_y;
				if (delta_scale) view.scale += delta_scale;
			},
			cursor: (state, props) => {
				const { id, x, y, rotation, type } = props.payload;
				const cursor = state.cursors.find((cursor) => id === cursor.id);
				if (x) cursor.x = x;
				if (y) cursor.y = y;
				if (rotation) cursor.rotation = rotation;
				if (type) cursor.type = type;
			},
			move: (state, props) => {
				const { position, last_position } = props.payload;
				state.elements.filter((element) => element.selected).forEach((element) => Elements[element.type].move(element, position, last_position));
			},
			select: (state, props) => {
				state.elements.find((element) => element.id === props.payload.id).selected = true;
			},
			unselect: (state) => {
				state.elements.forEach((element) => (element.selected = false));
			},
			hover: (state, props) => {
				state.elements.find((element) => element.id === props.payload.id).hover = true;
			},
			unhover: (state, props) => {
				state.elements.find((element) => element.id === props.payload.id).hover = false;
			},
			resize: (state, props) => {
				const { id, position, last_position } = props.payload;

				const selected = state.elements.filter((element) => element.selected);

				const target = state.elements.find((element) => id === element.id);

				const center = Elements[target.type].center(target);

				const direction_x = Math.sign(last_position.x - center.x);
				const direction_y = Math.sign(last_position.y - center.y);

				selected.forEach((element) => Elements[element.type].resize(element, position, last_position, direction_x, direction_y));
			},

			rotate: (state, props) => {
				const { id, position, last_position } = props.payload;

				const selected = state.elements.filter((element) => element.selected);

				const target = state.elements.find((element) => id === element.id);

				const center = Elements[target.type].center(target);

				const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

				selected.forEach((element) => Elements[element.type].rotate(element, rotation));

				const cursor = state.cursors.find((cursor) => '123' === cursor.id);
				cursor.rotation += rotation;
			},
		},
	});

	// const store = configureStore({
	// 	reducer: slice.reducer,
	// });
	// const store = createStore(slice.reducer, initial_state);
	const store = createStore(slice.reducer, initial_state, scuttlebutt({ primus: Primus }));

	store.subscribe(() => {
		window.localStorage.setItem('state', JSON.stringify(store.getState()));
	});

	return (
		<div id="cols">
			<Toolbar />
			<Canvas id={id} store={store} actions={slice.actions} />

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
