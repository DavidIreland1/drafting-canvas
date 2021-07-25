import { useRef, useEffect, useState } from 'react';

import { initCanvas } from './init';
import Elements from '../elements/elements';
import Cursor from '../cursor';
import Settings from '../settings';
import Grid from './grid';

const { line_width, box_size, highlight_color, user_id } = Settings;

const Canvas = ({ user_id, store, actions, ...rest }) => {
	const canvas_ref = useRef(null);

	let cursors = store.getState().cursors;
	let elements = store.getState().elements;

	let user_view = store.getState().views.find((view) => view.id === user_id);

	let [frames, setFrameRate] = useState([]);

	const auto_draw = false;

	let redraw_auto = (context: CanvasRenderingContext2D) => {
		requestAnimationFrame(() => {
			context.resetTransform();
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			if (Settings.grid_enabled) Grid.draw(context, user_view);
			context.translate(user_view.x, user_view.y);
			context.scale(user_view.scale, user_view.scale);

			elements.forEach((element) => {
				Elements[element.type].draw(element, context);
			});
			elements.forEach((element) => {
				if (element.selected || element.type === 'group') Elements[element.type].highlight(element, context, highlight_color, line_width / user_view.scale, box_size / user_view.scale);
				else if (element.hover) Elements[element.type].outline(element, context, highlight_color, (line_width * 2) / user_view.scale);
			});
			cursors
				.filter((cursor) => cursor.id !== user_id)
				.forEach((cursor) => {
					Cursor.draw(cursor, context, user_view);
				});

			Cursor.draw(
				cursors.find((cursor) => cursor.id === user_id),
				context,
				user_view
			);

			frames = frames.concat([frames.length]);
			setTimeout(() => {
				frames = frames.slice(1);
				setFrameRate(frames);
			}, 1000);

			if (auto_draw) redraw_auto(context);
		});
	};

	const redraw = auto_draw ? (contet) => {} : redraw_auto;

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d', { alpha: false });

		(window as any).canvas = canvas;
		(window as any).context = context;

		resizeCanvas(canvas);
		initCanvas(canvas, user_id, store, actions);

		window.addEventListener('resize', () => {
			resizeCanvas(canvas);
			redraw(context);
		});

		let last_draw = Date.now();
		store.subscribe(() => {
			user_view = store.getState().views.find((view) => view.id === user_id);
			cursors = store.getState().cursors;
			elements = store.getState().elements;

			const now = Date.now();
			if (now > last_draw + 1000 / 65) {
				redraw(context);
				last_draw = now;
			}
		});

		redraw_auto(context);
	}, []);

	return (
		<div>
			<canvas ref={canvas_ref} {...rest} />
			<div id="frame_rate">{frames[frames.length - 1] || 0}</div>

			<style jsx>{`
				canvas {
					width: 100%;
					height: 100%;
					background: var(--off-white);
					cursor: none;
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
		// (window as any).devicePixelRatio = 1;s
		const ratio = window.devicePixelRatio;
		canvas.width = width * ratio;
		canvas.height = height * ratio;
		return true;
	}

	return false;
}
