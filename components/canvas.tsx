import { useRef, useEffect } from 'react';

import { initCanvas } from './canvas/init';
import Elements from './canvas/elements/elements';

import Defaults from './defaults';
const { line_width, box_size, highlight_color } = Defaults;

const Canvas = (props) => {
	let { store, reducers, ...rest } = props;
	const canvas_ref = useRef(null);

	const view = {
		x: 0,
		y: 0,
		scale: 1,
	};
	let elements = store.getState().elements;

	const redraw = (context: CanvasRenderingContext2D) => {
		context.resetTransform();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.translate(view.x, view.y);
		context.scale(view.scale, view.scale);
		elements.forEach((element) => {
			Elements[element.type].draw(element, context);
		});

		elements.forEach((element) => {
			if (element.hover && !element.selected) Elements[element.type].outline(element, context, highlight_color, (line_width * 2) / view.scale);
		});

		elements.forEach((element) => {
			if (element.selected) Elements[element.type].highlight(element, context, highlight_color, line_width / view.scale, box_size / view.scale);
		});
	};

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d');

		(window as any).canvas = canvas;
		(window as any).context = context;

		initCanvas(canvas, context, view, redraw, store, reducers);

		store.subscribe(() => {
			elements = store.getState().elements;
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
