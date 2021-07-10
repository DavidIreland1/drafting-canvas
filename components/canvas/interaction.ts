import Elements from './elements/elements';

import Defaults from './../defaults';
const { max_zoom, min_zoom, pan_sensitivity, zoom_sensitivity } = Defaults;

export function onWheel(event: WheelEvent, canvas: HTMLCanvasElement, view) {
	if (String(event.deltaY).length < 5) {
		// Pan
		view.x -= event.deltaX * pan_sensitivity; // view.scale;
		view.y -= event.deltaY * pan_sensitivity; // view.scale;
	} else {
		// Zoom
		const delta_scale = event.deltaY * zoom_sensitivity * view.scale;
		if (view.scale - delta_scale < min_zoom) return;
		if (view.scale - delta_scale > max_zoom) return;
		view.scale -= delta_scale;

		const position = DOMToCanvas(event, canvas, view);
		view.x += position.x * delta_scale;
		view.y += position.y * delta_scale;
	}
}

// function DOMToCanvas(position, canvas, view) {
// 	const bounds = canvas.getBoundingClientRect();
// 	return {
// 		x: ((position.x - bounds.x) * window.devicePixelRatio) / view.scale - view.x,
// 		y: ((position.y - bounds.y) * window.devicePixelRatio) / view.scale - view.y,
// 	};
// }

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

export function onDoubleClick(view) {
	view.x = 0;
	view.y = 0;
	view.scale = 1;
}

export function hover(event, elements, canvas, view, store, reducers) {
	if (!['grab', 'default', 'nw-resize'].includes(canvas.style.cursor)) return;

	const position = DOMToCanvas(event, canvas, view);

	const hovering = elements.find((element) => element.hover);

	if (hovering) {
		if (!Elements[hovering.type].collide(hovering, position)) {
			store.dispatch(reducers.unhover({ id: hovering.id }));
			canvas.style.cursor = 'default';
		}
		return;
	}

	const selected = elements.find((element) => element.selected);
	if (selected) {
		if (!Elements[selected.type].collide(selected, position, view)) {
			store.dispatch(reducers.unhover({ id: selected.id }));
			canvas.style.cursor = 'default';
			return;
		}
	}

	const edit = [...elements.filter((element) => element.selected)].reverse().find((element) => Elements[element.type].collideEdit(element, position, view));

	if (edit) {
		canvas.style.cursor = 'nw-resize';
		return;
	}

	const target = [...elements].reverse().find((element) => Elements[element.type].collide(element, position));

	if (!target) return;
	canvas.style.cursor = 'grab';
	store.dispatch(reducers.hover({ id: target.id }));
}

export function select(event, elements, canvas, view, store, reducers) {
	if (event.button !== 0) return;
	let last_position = DOMToCanvas(event, canvas, view);

	if (!event.shiftKey) {
		store.dispatch(reducers.unselect());
	}

	const { target, action } = getElementAt(elements, last_position, view, reducers);

	if (!target) return;

	canvas.style.cursor = 'grabbing';

	store.dispatch(reducers.select({ id: target.id }));

	const move = (move_event) => {
		const position = DOMToCanvas(move_event, canvas, view);

		store.dispatch(action({ position, last_position }));

		last_position = position;
	};
	canvas.addEventListener('mousemove', move);
	canvas.addEventListener(
		'mouseup',
		() => {
			canvas.style.cursor = 'grab';
			canvas.removeEventListener('mousemove', move);
		},
		{ once: true }
	);
}

function getElementAt(elements, last_position, view, reducers) {
	const edit_element = [...elements.filter((element) => element.selected)].reverse().find((element) => Elements[element.type].collideEdit(element, last_position, view));
	if (edit_element) return { target: edit_element, action: reducers.resize };

	const target = [...elements].reverse().find((element) => Elements[element.type].collide(element, last_position));
	if (target) return { target: target, action: reducers.move };

	return { target: undefined, action: undefined };
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
