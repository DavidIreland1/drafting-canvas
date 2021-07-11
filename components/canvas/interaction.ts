import Elements from './elements/elements';

import Defaults from './../defaults';
const { line_width, box_size, max_zoom, min_zoom, pan_sensitivity, zoom_sensitivity } = Defaults;

export function onWheel(event: WheelEvent, canvas: HTMLCanvasElement, view, store, actions) {
	if (String(event.deltaY).length < 5) {
		// Pan
		store.dispatch(
			actions.view({
				id: '123',
				delta_x: -event.deltaX * pan_sensitivity,
				delta_y: -event.deltaY * pan_sensitivity,
			})
		);
		const cursor = store.getState().cursors.find((cursor) => '123' === cursor.id);

		store.dispatch(
			actions.cursor({
				id: '123',
				x: cursor.x + (event.deltaX * pan_sensitivity) / view.scale,
				y: cursor.y + (event.deltaY * pan_sensitivity) / view.scale,
			})
		);
	} else {
		// Zoom
		const delta_scale = event.deltaY * zoom_sensitivity * view.scale;
		if (view.scale - delta_scale < min_zoom) return;
		if (view.scale - delta_scale > max_zoom) return;

		const position = DOMToCanvas(event, canvas, view);
		store.dispatch(
			actions.view({
				id: '123',
				delta_x: position.x * delta_scale,
				delta_y: position.y * delta_scale,
				delta_scale: -delta_scale,
			})
		);
	}
}

function DOMToCanvas(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((position.x - bounds.x) * window.devicePixelRatio - view.x) / view.scale,
		y: ((position.y - bounds.y) * window.devicePixelRatio - view.y) / view.scale,
	};
}

function CanvasToDOM(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((position.x + view.x) * view.scale) / window.devicePixelRatio + bounds.x,
		y: ((position.y + view.y) * view.scale) / window.devicePixelRatio + bounds.y,
	};
}

export function hover(event, elements, canvas, view, store, actions) {
	const position = DOMToCanvas(event, canvas, view);

	const { target, action } = event.buttons > 0 ? { target: undefined, action: undefined } : getElementAt(elements, position, view);

	// const { target, action } = getElementAt(elements, position, view);

	let rotation = 0;
	if (target && ['resize', 'rotate'].includes(action)) {
		const element = elements.find((element) => element.id === target.id);
		const center = Elements[element.type].center(element);
		// rotation = element.rotation;
		rotation = Math.atan2(center.y - position.y, center.x - position.x);
		// console.log(rotation);
	}

	store.dispatch(actions.cursor({ id: '123', ...position, rotation, type: action }));
}

export function select(event, elements, canvas, view, store, actions) {
	let last_position = DOMToCanvas(event, canvas, view);

	const { target, action } = getElementAt(elements, last_position, view);

	if (!event.shiftKey && (!target || (target && !target.selected))) {
		store.dispatch(actions.unselect());
	}

	if (!target) return;

	store.dispatch(actions.select({ id: target.id }));

	const move = (move_event) => {
		const position = DOMToCanvas(move_event, canvas, view);

		store.dispatch(actions[action]({ id: target.id, position, last_position }));

		last_position = position;
	};
	window.addEventListener('mousemove', move);
	window.addEventListener(
		'mouseup',
		() => {
			window.removeEventListener('mousemove', move);
		},
		{ once: true }
	);
}

function getElementAt(elements, last_position, view) {
	const selected = [...elements.filter((element) => element.selected)].reverse();

	const resize = selected.find((element) => Elements[element.type].collideResize(element, last_position, box_size / view.scale));
	if (resize) return { target: resize, action: 'resize' };

	const rotate = selected.find((element) => Elements[element.type].collideRotate(element, last_position, box_size / view.scale));
	if (rotate) return { target: rotate, action: 'rotate' };

	const target = [...elements].reverse().find((element) => Elements[element.type].collide(element, last_position));
	if (target) return { target: target, action: 'move' };

	return { target: undefined, action: 'select' };
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

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
