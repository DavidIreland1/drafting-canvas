import { useRef, useEffect } from 'react';

import { initCanvas } from './canvas/init';
import { draw } from './canvas/draw';

const Canvas = (props) => {
	const { elements, ...rest } = props;
	// const canvas_ref = useCanvas(draw);
	const canvas_ref = useRef(null);

	const view = {
		x: 0,
		y: 0,
		scale: 1,
	};

	const redraw = (context: CanvasRenderingContext2D) => {
		context.resetTransform();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.scale(view.scale, view.scale);
		context.translate(view.x, view.y);
		elements.forEach((element) => {
			draw(context, element);
		});
	};

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvas_ref.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d');
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

function drawCircle(context, element) {
	context.beginPath();
	context.fillStyle = element.color;
	context.arc(element.x, element.y, element.radius, element.start_angle, element.end_angle);
	context.fill();
}
