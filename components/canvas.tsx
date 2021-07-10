import { useRef, useEffect } from 'react';

import { initCanvas } from './canvas/init';
import { draw, highlight, outline } from './canvas/shapes/shapes';

const Canvas = (props) => {
	let { store, reducers, ...rest } = props;
	const canvas_ref = useRef(null);

	const view = {
		x: 0,
		y: 0,
		scale: 1,
	};
	let elements = store.getState()[0].elements;

	const redraw = (context: CanvasRenderingContext2D) => {
		context.resetTransform();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.translate(view.x, view.y);
		context.scale(view.scale, view.scale);
		elements.forEach((element) => {
			draw(element, context);
		});

		elements.forEach((element) => {
			if (element.hover && !element.selected) outline(element, context, view);
		});

		elements.forEach((element) => {
			if (element.selected) highlight(element, context, view);
		});
	};

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d');

		(window as any).canvas = canvas;
		(window as any).context = context;

		initCanvas(canvas, context, view, redraw, store, reducers);

		store.subscribe(() => {
			elements = store.getState()[0].elements;
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
				}
			`}</style>
		</div>
	);
};

export default Canvas;
