import { useRef, useEffect } from 'react';
import draw from './draw';

import { initCanvas } from './init-canvas';

import TextLayer from './text-layer';

// This shading pollyfill for safari and firefox doesn't really work
// import('./polyfill');

export default function Canvas({ user_id, store, actions, ...rest }) {
	const canvas_ref = useRef(null);

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d'); //, { alpha: false } makes it flash black but is more efficient?

		// Just for console debugging
		(window as any).canvas = canvas;
		(window as any).context = context;

		const active = {
			hovering: [],
			selected: [],
			altering: [],
		};

		initCanvas(canvas, user_id, store, actions, active);

		store.subscribe(() => {
			const state = store.getState().present;

			const user_view = state.views.find((view) => view.id === user_id);
			const user_cursor = state.cursors.find((cursor) => cursor.id === user_id);

			if (user_view && user_view.centered === false) store.dispatch(actions.centerView({ user_id: user_id, x: canvas.width / 2, y: canvas.height / 2 }));

			const elements = state.elements;
			const cursors = state.cursors;
			draw(context, elements, cursors, active, user_id, user_view, user_cursor);
		});

		const resize_observer = observeResize(canvas, store, actions, user_id);

		return () => {
			resize_observer.disconnect();
		};
	}, [canvas_ref.current]);

	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg"  width='24' height='24' version="1.1" viewBox="0 0 100 100" stroke="white" stroke-width="4" >
			<path d="M 2 0 l 0 70 l 23 -15 l 32 -3 L 2 0" style="filter: drop-shadow( 2px 3px 2px)" />
		</svg>
	`;
	const cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0, auto;`;

	return (
		<div id="container">
			<TextLayer canvas={canvas_ref} user_id={user_id} store={store} actions={actions} />
			<canvas ref={canvas_ref} {...rest} tabIndex={1} />

			<style jsx>{`
				#container {
					position: relative;
				}
				canvas {
					width: 100%;
					height: 100%;
					background: var(--off-white);
					cursor: none;
					outline: none;
					cursor: ${cursor};
				}
			`}</style>
		</div>
	);
}

function observeResize(canvas, store, actions, user_id) {
	let last_x = canvas.getBoundingClientRect().left;
	let observer_started = false;

	const resize_observer = new ResizeObserver((entries) => {
		const { width, height } = entries[0].contentRect;

		if (observer_started) {
			observer_started = false;
			return;
		}
		observer_started = true;

		if (canvas.width === width && canvas.height === height) return;

		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;

		const delta_x = last_x - canvas.getBoundingClientRect().left;
		last_x -= delta_x;
		store.dispatch(
			actions.view({
				user_id: user_id,
				delta_x: delta_x * 2,
			})
		);
	});
	resize_observer.observe(canvas);

	return resize_observer;
}
