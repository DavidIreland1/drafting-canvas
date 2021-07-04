import { collide } from './collide';

// Gets the relevant location from a mouse or single touch event
function getEventLocation(event) {
	if (event.touches && event.touches.length == 1) {
		return { x: event.touches[0].clientX, y: event.touches[0].clientY };
	} else if (event.clientX && event.clientY) {
		return { x: event.clientX, y: event.clientY };
	}
}

// function drawRect(x, y, width, height) {
// 	ctx.fillRect(x, y, width, height);
// }

// function drawText(text, x, y, size, font) {
// 	ctx.font = `${size}px ${font}`;
// 	ctx.fillText(text, x, y);
// }

let isDragging = false;
let dragStart = { x: 0, y: 0 };

export function onPointerDown(event, cameraZoom, cameraOffset) {
	isDragging = true;
	dragStart.x = getEventLocation(event).x / cameraZoom - cameraOffset.x;
	dragStart.y = getEventLocation(event).y / cameraZoom - cameraOffset.y;
}

export function onPointerUp(even, cameraZoom) {
	isDragging = false;
	initialPinchDistance = null;
	// lastZoom = cameraZoom;
}

export function onPointerMove(event, cameraZoom, cameraOffset) {
	if (isDragging) {
		cameraOffset.x = getEventLocation(event).x / cameraZoom - dragStart.x;
		cameraOffset.y = getEventLocation(event).y / cameraZoom - dragStart.y;
	}
}

export function handleTouch(event, singleTouchHandler) {
	if (event.touches.length == 1) {
		singleTouchHandler(event);
	} else if (event.type == 'touchmove' && event.touches.length == 2) {
		isDragging = false;
		handlePinch(event);
	}
}

let initialPinchDistance = null;
// let lastZoom = cameraZoom;

export function handlePinch(event) {
	event.preventDefault();

	let touch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
	let touch2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };

	// This is distance squared, but no need for an expensive sqrt as it's only used in ratio
	let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

	if (initialPinchDistance == null) {
		initialPinchDistance = currentDistance;
	} else {
		// adjustZoom(null, currentDistance / initialPinchDistance);
	}
}

const MAX_ZOOM = 10;
const MIN_ZOOM = 0.01;
const PAN_SENSITIVITY = 0.7;
const ZOOM_SENSITIVITY = 0.005;

export function onWheel(event: WheelEvent, canvas: HTMLCanvasElement, view) {
	event.preventDefault();

	if (String(event.deltaY).length < 5) {
		// Pan
		view.x -= (event.deltaX * PAN_SENSITIVITY) / view.scale;
		view.y -= (event.deltaY * PAN_SENSITIVITY) / view.scale;
	} else {
		// Zoom
		const delta_scale = event.deltaY * ZOOM_SENSITIVITY;
		if (view.scale - delta_scale < MIN_ZOOM) return;
		if (view.scale - delta_scale > MAX_ZOOM) return;
		view.scale -= delta_scale;

		const position = DOMToCanvas(event, canvas, view);

		view.x += position.x * delta_scale;
		view.y += position.y * delta_scale;
	}
}

function DOMToCanvas(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((position.x - bounds.x) * window.devicePixelRatio + view.x) / view.scale,
		y: ((position.y - bounds.y) * window.devicePixelRatio + view.y) / view.scale,
	};
}

function CanvasToDOM(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: (position.x * view.scale - view.x) / window.devicePixelRatio + bounds.x,
		y: (position.y * view.scale - view.y) / window.devicePixelRatio + bounds.y,
	};
}

export function onDoubleClick(view) {
	view.x = 0;
	view.y = 0;
	view.scale = 1;
}

export function onMouseMove(event, elements, canvas, view) {
	const position = DOMToCanvas(event, canvas, view);
	const target = elements.reverse().find((element) => {
		return collide(position, element);
	});

	console.log(target);
}
