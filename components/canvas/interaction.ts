import Elements, { flatten } from './../elements/elements';

import Settings from '../settings';

const { line_width, box_size, max_zoom, min_zoom, pan_sensitivity, zoom_sensitivity } = Settings;

export function onWheel(event: WheelEvent, canvas: HTMLCanvasElement, user_id, store, actions) {
	const state = store.getState();
	const view = state.views.find((view) => view.id === user_id);

	if (String(event.deltaY).length < 5) {
		// Pan
		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		store.dispatch(
			actions.view({
				id: user_id,
				delta_x: -event.deltaX * pan_sensitivity,
				delta_y: -event.deltaY * pan_sensitivity,

				cursor_x: cursor.x + (event.deltaX * pan_sensitivity) / view.scale,
				cursor_y: cursor.y + (event.deltaY * pan_sensitivity) / view.scale,
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
				id: user_id,
				delta_x: position.x * delta_scale,
				delta_y: position.y * delta_scale,
				delta_scale: -delta_scale,
			})
		);
	}
}

export function DOMToCanvas(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((position.x - bounds.x) * window.devicePixelRatio - view.x) / view.scale,
		y: ((position.y - bounds.y) * window.devicePixelRatio - view.y) / view.scale,
	};
}

export function CanvasToDOM(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((position.x + view.x) * view.scale) / window.devicePixelRatio + bounds.x,
		y: ((position.y + view.y) * view.scale) / window.devicePixelRatio + bounds.y,
	};
}

let last_draw = Date.now();
export function hover(event, canvas, store, actions, id, active) {
	const view = store.getState().views.find((view) => view.id === id);

	if (!view) return;
	const position = DOMToCanvas(event, canvas, view);

	const target = active.altering.length ? active.altering[0].element : undefined;
	let action = active.altering.length ? active.altering[0].action : 'select';

	let rotation = 0;
	if (target && ['resize', 'rotate'].includes(action)) {
		const center = Elements[target.type].center(target);
		rotation = Math.atan2(center.y - position.y, center.x - position.x);
	} else if (target && action === 'stretch') {
		const center = Elements[target.type].center(target);
		rotation = Math.atan2(center.y - position.y, center.x - position.x);

		let sign = -1;
		if (Math.abs(rotation) < Math.PI / 4 || Math.abs(rotation) > (3 * Math.PI) / 4) {
			sign = 1;
		}
		rotation = target.rotation + (Math.PI / 4) * sign - Math.PI / 4;
	}

	if (event.buttons) action = undefined;
	// Reduce max action rate or frame rate
	// const now = Date.now();
	// if (now > last_draw + 1000 / 65) {
	store.dispatch(actions.cursor({ id: Settings.user_id, ...position, rotation, type: action }));
	// 	last_draw = now;
	// }
}

export function select(down_event, canvas, id, store, actions, active) {
	const state = store.getState();
	const view = state.views.find((view) => view.id === id);

	let last_position = DOMToCanvas(event, canvas, view);

	let action = 'move';
	let target = active.hovering[0];

	if (active.altering.length) {
		action = active.altering[0].action;
		target = active.altering[0].element;
	}

	if (!target) return down_event.shiftKey ? undefined : store.dispatch(actions.unselectAll());

	const was_selected = target.selected;

	if (down_event.shiftKey) {
		store.dispatch(actions.select({ id: target.id }));
	} else {
		store.dispatch(actions.selectOnly({ select: [target.id] }));
	}

	const move = (move_event) => {
		const position = DOMToCanvas(move_event, canvas, view);
		store.dispatch(actions[action]({ user_id: Settings.user_id, id: target.id, position, last_position }));
		last_position = position;
	};
	window.addEventListener('mousemove', move);

	const release = (up_event) => {
		if (down_event.clientX === up_event.clientX && down_event.clientY === up_event.clientY) {
			if (was_selected) {
				store.dispatch(actions.unselect({ id: target.id }));
			}
		}
		window.removeEventListener('mousemove', move);
	};
	window.addEventListener('mouseup', release, { once: true });
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

let isDragging = false;
let dragStart = { x: 0, y: 0 };

export function touch(event, view) {
	isDragging = true;
	dragStart.x = getEventLocation(event).x / view.scale - view.x;
	dragStart.y = getEventLocation(event).y / view.scale - view.y;
}

export function release(event, view) {
	isDragging = false;
	initialPinchDistance = null;
	// lastZoom = view.scale;
}

export function touchMove(event, view) {
	if (isDragging) {
		view.x = getEventLocation(event).x / view.scale - dragStart.x;
		view.y = getEventLocation(event).y / view.scale - dragStart.y;
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
// let lastZoom = view.scale;

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
