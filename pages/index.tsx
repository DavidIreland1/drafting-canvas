import Head from 'next/head';
import Navbar from '../components/navbar';
import Canvas from '../components/canvas';
import Toolbar from '../components/toolbar';

import getPages from './../hooks/get-page';

import { createSlice, configureStore } from '@reduxjs/toolkit';
import { move, resize } from '../components/canvas/shapes/shapes';

export default function Home(): JSX.Element {
	let pages = getPages();

	const slice = createSlice({
		name: 'counter',
		initialState: pages,
		reducers: {
			move: (state, props) => {
				const { position, last_position } = props.payload;
				state[0].elements
					.filter((element) => element.selected)
					.forEach((element) => {
						move(element, position, last_position);
					});
			},
			select: (state, props) => {
				state[0].elements.find((element) => element.id === props.payload.id).selected = true;
			},
			unselect: (state) => {
				state[0].elements.forEach((element) => (element.selected = false));
			},
			hover: (state, props) => {
				state[0].elements.find((element) => element.id === props.payload.id).hover = true;
			},
			unhover: (state, props) => {
				state[0].elements.find((element) => element.id === props.payload.id).hover = false;
			},
			resize: (state, props) => {
				const { position, last_position } = props.payload;
				state[0].elements
					.filter((element) => element.selected)
					.forEach((element) => {
						resize(element, position, last_position);
					});
			},
		},
	});
	const store = configureStore({
		reducer: slice.reducer,
	});

	// console.log(store.getState());
	// Can still subscribe to the store
	// store.subscribe(() => console.log(store.getState()));

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
					<Canvas store={store} reducers={slice.actions} />
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
