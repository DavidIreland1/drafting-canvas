import { useRef, useEffect } from 'react';

import { initCanvas, initElement } from './canvas/init';

const Canvas = (props) => {
	let { elements, ...rest } = props;
	const canvas_ref = useRef(null);

	const view = {
		x: 0,
		y: 0,
		scale: 1,
	};

	elements = elements.map(initElement);

	const redraw = (context: CanvasRenderingContext2D) => {
		context.resetTransform();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.translate(view.x, view.y);
		context.scale(view.scale, view.scale);

		elements.forEach((element) => {
			element.draw(context);
		});

		elements.forEach((element) => {
			if (element.hover && !element.selected) element.outline(context, view);
		});

		elements.forEach((element) => {
			if (element.selected) element.highlight(context, view);
		});
	};

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d');

		(window as any).canvas = canvas;
		(window as any).context = context;

		initCanvas(canvas, context, view, redraw, elements);
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
