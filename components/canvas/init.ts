import { onWheel, onDoubleClick, onMouseMove, onMouseDown } from './interaction';

import Ellipse from './elements/ellipse';
import Circle from './elements/circle';
import Group from './elements/group';

export function initCanvas(canvas, context, view, redraw, elements) {
	resizeCanvas(canvas);

	canvas.addEventListener('wheel', (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, view);
		redraw(context);
	});

	canvas.addEventListener('dblclick', (event) => {
		event.preventDefault();
		onDoubleClick(view);
		redraw(context);
	});

	canvas.style.cursor = 'default';
	canvas.addEventListener('mousemove', (event) => {
		event.preventDefault();
		onMouseMove(event, elements, canvas, view, context, redraw);
	});

	canvas.addEventListener('mousedown', (event) => {
		event.preventDefault();
		onMouseDown(event, elements, canvas, view, context, redraw);
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
		// window.devicePixelRatio = 1;

		const ratio = window.devicePixelRatio;
		canvas.width = width * ratio;
		canvas.height = height * ratio;
		return true;
	}

	return false;
}

export function initElement(element: any) {
	switch (element.type) {
		case 'ellipse':
			return new Ellipse(element);
		case 'circle':
			return new Circle(element);
		case 'group':
			return new Group(element);
	}
}
