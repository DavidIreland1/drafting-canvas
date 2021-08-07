import { useRef, useEffect, useState } from 'react';

import { initCanvas } from './init-canvas';
import Elements, { flatten } from './../elements/elements';
import Cursor from '../cursor/cursor';
import Settings from './../settings';
import Grid from './grid';

const { line_width, box_size, highlight } = Settings;

const Canvas = ({ user_id, store, actions, ...rest }) => {
	const canvas_ref = useRef(null);

	const state = store.getState().present;

	let cursors = state.cursors;
	let elements = state.elements;
	let user_view = state.views.find((view) => view.id === user_id);
	let user_cursor = cursors.find((cursor) => cursor.id === user_id);

	let [frames, setFrameRate] = useState(0);

	let last_frame = Date.now();

	const auto_draw = false;

	const active = {
		hovering: [],
		selected: [],
		altering: [],
	};

	let redraw_auto = (context: CanvasRenderingContext2D) => {
		if (!user_view || !user_cursor) return setTimeout(() => redraw_auto(context), 500);

		requestAnimationFrame(() => {
			context.resetTransform();
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			if (Settings.grid_enabled) Grid.draw(context, user_view);
			context.translate(user_view.x, user_view.y);
			context.scale(user_view.scale, user_view.scale);

			const screen = boundScreen(context, user_view);

			const onScreen = elements.filter((element) => Elements[element.type].onScreen(element, screen));

			const line = line_width / user_view.scale;
			const box = box_size / user_view.scale;
			const cursor = transformPoint(user_cursor, context.getTransform());

			active.selected = flatten(onScreen).filter((element) => element.selected);

			active.hovering = active.selected
				.filter((element) => Elements[element.type].insideBound(element, context, cursor))
				.concat(
					[...onScreen]
						.reverse()
						.filter((element) => Elements[element.type].draw(element, context, cursor))
						.reverse()
				);

			active.hovering = active.hovering.sort((element1) => (element1.selected ? -1 : 1));

			// Outline hovering
			active.hovering.slice(0, 1).forEach((element) => (element.selected ? undefined : Elements[element.type].outline(element, context, highlight, line * 2)));

			active.altering = active.selected.map((element) => Elements[element.type].highlight(element, context, cursor, highlight, line, box)).filter((element) => element);

			[...cursors].sort((c1, c2) => (c1.id !== user_id ? -1 : 1)).forEach((cursor) => Cursor.draw(cursor, context, user_view));

			const now = Date.now();
			setFrameRate(Math.round(Math.round(1000 / (now - last_frame))));
			last_frame = now;

			if (auto_draw) redraw_auto(context);
		});
	};

	const redraw = auto_draw ? (contet) => true : redraw_auto;

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false });

		(window as any).canvas = canvas;
		(window as any).context = context;

		resizeCanvas(canvas);
		initCanvas(canvas, user_id, store, actions, active);

		window.addEventListener('resize', () => {
			resizeCanvas(canvas);
			redraw(context);
		});

		store.subscribe(() => {
			// if (Math.random() > 0.95) console.log(JSON.stringify(store.getState()));
			const state = store.getState().present;

			user_view = state.views.find((view) => view.id === user_id);
			user_cursor = cursors.find((cursor) => cursor.id === user_id);
			cursors = state.cursors;
			elements = state.elements;
			redraw(context);
		});

		redraw_auto(context);
	}, []);

	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg"  width='24' height='24' version="1.1" viewBox="0 0 100 100" stroke="white" stroke-width="4" >
			<path d="M 2 0 l 0 70 l 23 -15 l 32 -3 L 2 0" style="filter: drop-shadow( 2px 3px 2px)" />
		</svg>
	`;
	const cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0, auto;`;

	return (
		<div>
			<canvas ref={canvas_ref} {...rest} tabIndex={1} />
			<div id="frame_rate">{frames || 0}</div>

			<style jsx>{`
				canvas {
					width: 100%;
					height: 100%;
					background: var(--off-white);
					cursor: none;
					outline: none;
					cursor: ${cursor};
				}
				#frame_rate {
					position: absolute;
					left: 50%;
					bottom: 0;
					width: min-content;
					padding: 20px;
				}
			`}</style>
		</div>
	);
};

export default Canvas;

export function resizeCanvas(canvas): boolean {
	const { width, height } = canvas.getBoundingClientRect();

	if (canvas.width !== width || canvas.height !== height) {
		// (window as any).devicePixelRatio = 1;
		const ratio = window.devicePixelRatio;
		canvas.width = width * ratio;
		canvas.height = height * ratio;
		return true;
	}

	return false;
}

function transformPoint(point, transform) {
	return {
		x: transform.a * point.x + transform.c * point.y + transform.e,
		y: transform.b * point.x + transform.d * point.y + transform.f,
	};
}

function boundScreen(context, view) {
	return {
		x1: -view.x / view.scale,
		y1: -view.y / view.scale,
		x2: -view.x / view.scale + context.canvas.width / view.scale,
		y2: -view.y / view.scale + context.canvas.height / view.scale,
	};
}
