import { useRef, useEffect } from 'react';

import { initCanvas } from './init';
import Elements from '../elements/elements';
import Cursor from '../cursor';
import Settings from '../settings';

const { line_width, box_size, highlight_color } = Settings;

const Canvas = (props) => {
	let { id, store, actions, ...rest } = props;
	const canvas_ref = useRef(null);

	if (typeof store.subscribe === 'function') {
		store = {
			views: store,
			cursors: store,
			elements: store,
		};
	}

	let views = store.views.getState();
	let cursors = store.cursors.getState();
	let elements = store.elements.getState();

	let view = views.find((view) => view.id === id);

	const redraw = (context: CanvasRenderingContext2D) => {
		requestAnimationFrame(() => {
			context.resetTransform();
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			context.translate(view.x, view.y);
			context.scale(view.scale, view.scale);

			elements.forEach((element) => {
				Elements[element.type].draw(element, context);
			});
			elements.forEach((element) => {
				if (element.selected) Elements[element.type].highlight(element, context, highlight_color, line_width / view.scale, box_size / view.scale);
				else if (element.hover) Elements[element.type].outline(element, context, highlight_color, (line_width * 2) / view.scale);
			});
			cursors.forEach((cursor) => {
				Cursor.draw(cursor, context, view);
			});
		});
	};

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d');

		(window as any).canvas = canvas;
		(window as any).context = context;

		resizeCanvas(canvas);
		initCanvas(canvas, id, store.elements, store.views, store.cursors, actions);

		window.addEventListener('resize', () => {
			resizeCanvas(canvas);
			redraw(context);
		});

		store.views.subscribe(() => {
			views = store.views.getState();
			view = views.find((view) => view.id === id);
			redraw(context);
		});
		store.cursors.subscribe(() => {
			cursors = store.cursors.getState();
			redraw(context);
		});
		store.elements.subscribe(() => {
			elements = store.elements.getState();
			redraw(context);
		});
	}, []);

	return (
		<div>
			<canvas ref={canvas_ref} {...rest} />

			<style jsx>{`
				canvas {
					width: 100%;
					height: 100%;
					background: var(--off-white);
					cursor: none;
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
