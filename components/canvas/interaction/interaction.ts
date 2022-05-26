import Settings from '../../settings';
import Elements from '../../canvas/elements/elements';
import move from './move';
import select from './select';
import { DOMToCanvas, generateID, split } from '../../../utils/utils';
import { roundPoint } from './round-point';
import actions from '../../../redux/slice';
import edit from './edit';

export function hover(event: MouseEvent, canvas, store, id, active) {
	const view = store.getState().present.views.find((view) => view.id === id);
	const cursor = store.getState().present.cursors.find((view) => view.id === id);

	if (!view) return;
	const position = DOMToCanvas(event, canvas, view);

	if (cursor.mode === 'create') return store.dispatch(actions.cursor({ user_id: Settings.user_id, ...position }));

	const target = active.altering[0]?.element;
	const action = active.altering[0]?.action ?? (event.buttons ? undefined : 'select');

	const rotation = cursorRotation(target, position, cursor);

	store.dispatch(actions.cursor({ user_id: Settings.user_id, ...position, rotation, type: cursor.pressed ? cursor.type : action, visible: true }));
	store.dispatch(actions.hoverOnly({ id: active.hovering[0]?.id }));
}

function cursorRotation(target, position, cursor) {
	if (!target) return cursor.rotation;
	if (cursor.type === 'spread') return target.rotation;
	if (cursor.type === 'stretch') return target.rotation - Math.PI / 2;
	if (cursor.type === 'resize' || cursor.type === 'rotate') {
		const center = Elements[target.type].center(target);
		return Math.atan2(center.y - position.y, center.x - position.x);
	}
	return cursor.rotation;
}

// Needs refactor to use strategy design pattern
export function singleClick(down_event, canvas, user_id, store, active) {
	if (down_event.button !== 0) return;
	if (active.selected.length) store.dispatch(actions.cursor({ user_id: user_id, pressed: true }));
	down_event.preventDefault();

	const state = store.getState().present;
	const view = state.views.find((view) => view.id === user_id);
	const cursor = state.cursors.find((cursor) => cursor.id === user_id);

	console.log(state.views);

	const points = state.elements
		.filter((element) => !element.selected)
		.map((element) => Elements[element.type].points(element))
		.flat();

	let position = DOMToCanvas(down_event, canvas, view);
	position = roundPoint(position, [position], points, view);

	if (cursor.mode === 'create') {
		create(position, canvas, store, view, cursor, points);
	} else {
		select(store, active, down_event);
		applyAction(down_event, position, canvas, store, active, view);
	}
}

function applyAction(down_event, last_position, canvas, store, active, view) {
	if (active.altering.length > 0) {
		const action = active.altering[0].action;
		const target = active.altering[0].element;
		if (action === 'resize' || action === 'stretch' || action === 'spread' || action === 'rotate') {
			const move = (move_event) => {
				let position = DOMToCanvas(move_event, canvas, view);
				const state = store.getState().present;
				let [, points] = split(state.elements, (element) => element.selected).map((elements) => elements.map((element) => Elements[element.type].points(element)).flat());
				position = roundPoint(position, [] /*[position]*/, points, view);
				const selected_ids = state.elements.filter((element) => element.selected).map((element) => element.id);
				store.dispatch(actions[action]({ user_id: Settings.user_id, id: target.id, position, last_position, selected_ids }));
				last_position = position;
			};
			window.addEventListener('mousemove', move);

			const release = () => window.removeEventListener('mousemove', move);
			window.addEventListener('mouseup', release, { once: true });
		} else if (action === 'edit') {
			edit(canvas, store, view, target, last_position, down_event, active.altering[0].point);
		}
	} else if (active.hovering.length > 0) {
		const target = active.hovering[0];
		move(canvas, store, view, target, last_position, down_event);
	}
}

function create(last_position, canvas, store, view, cursor, points) {
	const id = generateID();
	let expanded = false;
	const first_position = {
		x: last_position.x,
		y: last_position.y,
	};
	store.dispatch(actions.createElement({ user_id: Settings.user_id, id: id, type: cursor.type, position: last_position }));

	const move = (move_event) => {
		let position = DOMToCanvas(move_event, canvas, view);
		if (Math.abs(first_position.x - position.x) + Math.abs(first_position.x - position.y) > 10) expanded = true;
		position = roundPoint(position, [position], points, view);
		store.dispatch(actions.resize({ user_id: Settings.user_id, id: id, position, last_position, selected_ids: [id] }));
		last_position = position;
	};
	window.addEventListener('mousemove', move);

	const release = () => {
		if (expanded === false) {
			store.dispatch(
				actions.resize({
					user_id: Settings.user_id,
					id: id,
					position: { x: last_position.x + 101, y: last_position.y + 101 },
					last_position,
					selected_ids: [id],
				})
			);
		}
		window.removeEventListener('mousemove', move);
	};

	window.addEventListener('mouseup', release, { once: true });
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// // Gets the relevant location from a pointer or single touch event
// function getEventLocation(event) {
// 	if (event.touches && event.touches.length == 1) {
// 		return { x: event.touches[0].clientX, y: event.touches[0].clientY };
// 	} else if (event.clientX && event.clientY) {
// 		return { x: event.clientX, y: event.clientY };
// 	}
// }

// let isDragging = false;
// let dragStart = { x: 0, y: 0 };

// export function touch(event, view) {
// 	isDragging = true;
// 	dragStart.x = getEventLocation(event).x / view.scale - view.x;
// 	dragStart.y = getEventLocation(event).y / view.scale - view.y;
// }

// export function release(event, view) {
// 	isDragging = false;
// 	initialPinchDistance = null;
// 	// lastZoom = view.scale;
// }

// export function touchMove(event, view) {
// 	if (isDragging) {
// 		view.x = getEventLocation(event).x / view.scale - dragStart.x;
// 		view.y = getEventLocation(event).y / view.scale - dragStart.y;
// 	}
// }

// export function handleTouch(event, singleTouchHandler) {
// 	if (event.touches.length == 1) {
// 		singleTouchHandler(event);
// 	} else if (event.type == 'touchmove' && event.touches.length == 2) {
// 		isDragging = false;
// 		handlePinch(event);
// 	}
// }

// let initialPinchDistance = null;
// // let lastZoom = view.scale;

// export function handlePinch(event) {
// 	let touch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
// 	let touch2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };

// 	// This is distance squared, but no need for an expensive sqrt as it's only used in ratio
// 	let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

// 	if (initialPinchDistance == null) {
// 		initialPinchDistance = currentDistance;
// 	} else {
// 		// adjustZoom(null, currentDistance / initialPinchDistance);
// 	}
// }
