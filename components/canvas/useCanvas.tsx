import { useRef, useState, useEffect } from 'react';

import { onWheel, onDoubleClick } from './interaction';

const useCanvas = (draw) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvasRef.current;
		const context: CanvasRenderingContext2D = canvas.getContext('2d');

		(window as any).canvas = canvas;
		(window as any).context = context;

		// canvas.addEventListener('wheel', (event: WheelEvent) => {
		// 	onWheel(event, canvas, view);
		// });

		// canvas.addEventListener('dblclick', () => {
		// 	onDoubleClick(view);
		// });
		// window.addEventListener('resize', () => {
		// 	resizeCanvas(canvas);
		// });

		// canvas.addEventListener('mousedown', onPointerDown);
		// canvas.addEventListener('touchstart', (event) => handleTouch(event, onPointerDown));
		// canvas.addEventListener('mouseup', onPointerUp);
		// canvas.addEventListener('touchend', (event) => handleTouch(event, onPointerUp));
		// canvas.addEventListener('mousemove', onPointerMove);
		// canvas.addEventListener('touchmove', (event) => handleTouch(event, onPointerMove));

		// let animationFrameId;

		// const render = () => {
		// 	context.resetTransform();
		// 	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		// 	context.scale(view.scale, view.scale);
		// 	context.translate(view.x, view.y);

		// 	draw(context);

		// 	console.log('render');

		// 	animationFrameId = window.requestAnimationFrame(render);
		// };
		// render();

		// return () => {
		// 	window.cancelAnimationFrame(animationFrameId);
		// };
	}, [draw]);

	return canvasRef;
};

export default useCanvas;
