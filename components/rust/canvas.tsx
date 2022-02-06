import { useRef, useEffect } from 'react';

import TextLayer from './../canvas/text-layer';
import { initCanvas } from './../canvas/init-canvas';
import Colors from './../properties/colors';

let draw;
import('./../../pkg').then((module) => (draw = module.draw));

let x = 75;
let y = 75;

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
			if (draw === undefined) return;
			const state = store.getState().present;
			const elements = state.elements.map((element) => ({ ...element, _type: element.type, fill: element.fill.map((fill) => ({ ...fill, _type: fill.type, color: fill.color.map((val) => Math.floor(255 * val)) })) }));

			// let elements = [{ id: 'rect_123', label: 'Rectangle', _type: 'rectangle', x: -100, y: 0, rotation: 0, width: 50, height: 80, radius: 0 }];
			const views = state.views;
			const cursors = state.cursors.map((cursor) => ({ ...cursor, _type: cursor.type }));

			// console.log(views.length ? views[0].scale : '');
			const result = draw(elements, views, cursors, user_id);
			console.log(result);
		});

		document.addEventListener(
			'wheel',
			(event) => {
				event.preventDefault();
				x -= event.deltaX;
				y -= event.deltaY;
			},
			{ passive: false }
		);

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
			{/* <TextLayer canvas={canvas_ref} user_id={user_id} store={store} actions={actions} /> */}
			<canvas id="canvas" ref={canvas_ref} {...rest} tabIndex={1} />

			<style jsx>{`
				#container {
					position: relative;
				}
				canvas {
					width: 100%;
					height: 100%;
					/* background: brown; */
					cursor: none;
					outline: none;
					cursor: ${cursor};
					--checker-size: 8px;
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
