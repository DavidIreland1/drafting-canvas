import { useRef, useEffect } from 'react';
import draw from './draw';

import { initCanvas } from './init-canvas';

import TextLayer from './text-layer';

const Canvas = ({ user_id, store, actions, ...rest }) => {
	const canvas_ref = useRef(null);

	const state = store.getState().present;

	let cursors = state.cursors;
	let elements = state.elements;
	let user_view = state.views.find((view) => view.id === user_id);
	let user_cursor = cursors.find((cursor) => cursor.id === user_id);

	const active = {
		hovering: [],
		selected: [],
		altering: [],
	};

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d'); //, { alpha: false } makes it flash black but is more efficient?

		// Just for console debugging
		(window as any).canvas = canvas;
		(window as any).context = context;

		resizeCanvas(canvas);
		initCanvas(canvas, user_id, store, actions, active);

		canvas.addEventListener('resize', () => console.log('hello'));

		store.subscribe(() => {
			const state = store.getState().present;

			user_view = state.views.find((view) => view.id === user_id);
			user_cursor = state.cursors.find((cursor) => cursor.id === user_id);

			if (user_view && user_view.centered === false) store.dispatch(actions.centerView({ user_id: user_id, x: canvas.width / 2, y: canvas.height / 2 }));

			elements = state.elements;
			cursors = state.cursors;
			draw(context, elements, cursors, active, user_id, user_view, user_cursor);
		});

		let last_x = canvas.getBoundingClientRect().left;

		const resize_observer = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;

			if (canvas.width !== width || canvas.height !== height) {
				(window as any).devicePixelRatio = 2; // This should not be needed
				const ratio = window.devicePixelRatio;
				canvas.width = width * ratio;
				// canvas.height = height * ratio;
			}

			const delta_x = last_x - canvas.getBoundingClientRect().left;
			last_x -= delta_x;
			store.dispatch(
				actions.view({
					user_id: user_id,
					delta_x: delta_x * 2,
				})
			);
		});
		resize_observer.observe(canvas_ref.current);

		return () => {
			resize_observer.unobserve(canvas_ref.current);
		};
	}, [canvas_ref.current]);

	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg"  width='24' height='24' version="1.1" viewBox="0 0 100 100" stroke="white" stroke-width="4" >
			<path d="M 2 0 l 0 70 l 23 -15 l 32 -3 L 2 0" style="filter: drop-shadow( 2px 3px 2px)" />
		</svg>
	`;
	const cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0, auto;`;

	return (
		<div>
			<TextLayer canvas={canvas_ref} user_id={user_id} store={store} actions={actions} />
			<canvas ref={canvas_ref} {...rest} tabIndex={1} />

			<style jsx>{`
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
};

export default Canvas;

export function resizeCanvas(canvas): boolean {
	const { width, height } = canvas.getBoundingClientRect();

	if (canvas.width !== width || canvas.height !== height) {
		(window as any).devicePixelRatio = 2; // This should not be needed
		const ratio = window.devicePixelRatio;
		canvas.width = width * ratio;
		canvas.height = height * ratio * 0.9;
		return true;
	}

	return false;
}
