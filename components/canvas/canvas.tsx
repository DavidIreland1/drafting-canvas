import { useRef, useEffect, useState } from 'react';

import { initCanvas } from './init-canvas';
import Elements, { flatten } from './../elements/elements';
import Cursor from './../cursor';
import Settings from './../settings';
import Grid from './grid';

const { line_width, box_size, highlight } = Settings;

const Canvas = ({ user_id, store, actions, ...rest }) => {
	const canvas_ref = useRef(null);

	let cursors = store.getState().cursors;
	let elements = store.getState().elements;
	let user_view = store.getState().views.find((view) => view.id === user_id);
	let user_cursor = cursors.find((cursor) => cursor.id === user_id);

	let [frames, setFrameRate] = useState([]);

	const auto_draw = false;

	const active = {
		hover: [],
		selected: [],
		acting: [],
	};

	let redraw_auto = (context: CanvasRenderingContext2D) => {
		requestAnimationFrame(() => {
			if (!user_view || !user_cursor) return;
			context.resetTransform();
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			if (Settings.grid_enabled) Grid.draw(context, user_view);
			context.translate(user_view.x, user_view.y);
			context.scale(user_view.scale, user_view.scale);

			const line = line_width / user_view.scale;
			const box = box_size / user_view.scale;
			const cursor = transformPoint(user_cursor, context.getTransform());

			active.hover = [...elements]
				.reverse()
				.filter((element) => Elements[element.type].draw(element, context, cursor))
				.reverse();

			active.selected = flatten(elements).filter((element) => element.selected);

			active.acting = active.selected.map((element) => Elements[element.type].highlight(element, context, cursor, highlight, line, box)).filter((element) => element);

			cursors.filter((cursor) => cursor.id !== user_id).forEach((cursor) => Cursor.draw(cursor, context, user_view));
			Cursor.draw(user_cursor, context, user_view);

			frames = frames.concat([frames.length]);
			setTimeout(() => {
				frames = frames.slice(1);
				setFrameRate(frames);
			}, 1000);

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

		let last_draw = Date.now();
		store.subscribe(() => {
			const now = Date.now();
			if (now < last_draw + 1000 / 65) return; // Frame limit
			last_draw = now;

			const state = store.getState();
			user_view = state.views.find((view) => view.id === user_id);
			user_cursor = cursors.find((cursor) => cursor.id === user_id);
			cursors = state.cursors;
			elements = state.elements;

			redraw(context);
		});

		redraw_auto(context);
	}, []);

	return (
		<div>
			<canvas ref={canvas_ref} {...rest} tabIndex={1} />
			<div id="frame_rate">{frames[frames.length - 1] || 0}</div>

			<style jsx>{`
				canvas {
					width: 100%;
					height: 100%;
					background: var(--off-white);
					cursor: none;
					outline: none;
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
