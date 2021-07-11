import { useEffect } from 'react';

import Head from 'next/head';
import Navbar from '../components/navbar';
import Canvas from '../components/canvas';
import Toolbar from '../components/toolbar';

import getPage from '../state/dev';

import { createSlice, configureStore } from '@reduxjs/toolkit';
import Elements from '../components/canvas/elements/elements';

export default function Home(): JSX.Element {
	useEffect(() => {
		// const pages = window.localStorage.getItem('state');
		const pages = getPage();

		// store.dispatch(
		// 	slice.actions.overwrite({
		// 		state: pages,
		// 	})
		// );
	}, []);

	const pages = getPage();

	const slice = createSlice({
		name: 'counter',
		initialState: pages, //{ views: [{ id: '', x: 0, y: 0, scale: 0 }], cursors: [], elements: [] },
		reducers: {
			overwrite: (state, props) => {
				state = props.payload.state;
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

				const theta = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

				selected.forEach((element) => Elements[element.type].rotate(element, theta));
			},
		},
	});

	const store = configureStore({
		reducer: slice.reducer,
	});

	// console.log(store.getState());
	// Can still subscribe to the store
	store.subscribe(() => {
		window.localStorage.setItem('state', JSON.stringify(store.getState()));
	});

	// Still pass action objects to `dispatch`, but they're created for us
	// store.dispatch(move('hi'));
	// // {value: 1}
	// store.dispatch(incremented());
	// // {value: 2}
	// store.dispatch(decremented());
	// {value: 1}

	return (
		<div className="container">
			<Head>
				<title>Off White Canvas</title>
				<link rel="icon" href="/favicon.svg" />
			</Head>

			<main>
				<Navbar />

				<div id="cols">
					<Toolbar />
					<Canvas id="123" store={store} actions={slice.actions} />
				</div>
			</main>

			<style jsx>{``}</style>

			<style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					height: 100vh;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
					background: var(--off-white);
				}
				* {
					box-sizing: border-box;
				}

				main {
					height: 100vh;
					display: grid;
					grid-template-rows: min-content;
				}
				#cols {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content;
				}
				:root {
					--nav-background: #545454;

					--title-color: #ffffff;
					--text-color: #ffffff;

					--off-white: #f1f1f1;

					--accent: #ea7661;
					--hover: #6d7282;

					--shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);

					--nav-height: 4vh;
				}
			`}</style>
		</div>
	);
}
