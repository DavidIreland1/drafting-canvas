import { onWheel, onDoubleClick, onMouseMove } from './interaction';

export function initCanvas(canvas, context, view, redraw, elements) {
	resizeCanvas(canvas);

	canvas.addEventListener('wheel', (event: WheelEvent) => {
		onWheel(event, canvas, view);
		redraw(context);
	});

	canvas.addEventListener('dblclick', () => {
		onDoubleClick(view);
		redraw(context);
	});

	canvas.addEventListener('mousemove', (event) => {
		onMouseMove(event, elements, canvas, view);
	});

	redraw(context);
}

export function resizeCanvas(canvas): boolean {
	const { width, height } = canvas.getBoundingClientRect();

	if (canvas.width !== width || canvas.height !== height) {
		window.devicePixelRatio = 1;

		const ratio = window.devicePixelRatio;
		const context = canvas.getContext('2d');
		canvas.width = width * ratio;
		canvas.height = height * ratio;
		context.scale(window.devicePixelRatio, window.devicePixelRatio);
		return true;
	}

	return false;
}
