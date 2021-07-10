import { onWheel, onDoubleClick, hover, select } from './interaction';

export function initCanvas(canvas, context, view, redraw, store, reducers) {
	resizeCanvas(canvas);

	canvas.addEventListener('wheel', (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, view);
		redraw(context);
	});

	canvas.addEventListener('dblclick', (event) => {
		event.preventDefault();
		onDoubleClick(view);
	});

	canvas.style.cursor = 'default';
	canvas.addEventListener('mousemove', (event) => {
		event.preventDefault();
		hover(event, store.getState()[0].elements, canvas, view, store, reducers);
	});

	canvas.addEventListener('mousedown', (event) => {
		event.preventDefault();
		select(event, store.getState()[0].elements, canvas, view, store, reducers);
	});

	window.addEventListener('resize', () => {
		resizeCanvas(canvas);
		redraw(context);
	});

	redraw(context);
}

export function resizeCanvas(canvas): boolean {
	const { width, height } = canvas.getBoundingClientRect();

	if (canvas.width !== width || canvas.height !== height) {
		const ratio = window.devicePixelRatio;
		canvas.width = width * ratio;
		canvas.height = height * ratio;
		return true;
	}

	return false;
}
