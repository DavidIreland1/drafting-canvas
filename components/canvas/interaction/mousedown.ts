import Settings from '../../settings';
import Elements from '../../canvas/elements/elements';
import move from './move';
import select from './select';
import { DOMToCanvas, generateID, split } from '../../../utils/utils';
import { roundPoint } from './round-point';
import actions from '../../../redux/slice';
import edit from './edit';

// Needs refactor to use strategy design pattern
export default function mousedown(down_event, canvas, user_id, store, active) {
	canvas.focus();
	if (down_event.button !== 0) return;
	if (active.selected.length) store.dispatch(actions.cursor({ user_id: user_id, pressed: true }));
	down_event.preventDefault();

	const state = store.getState().present;
	const view = state.views.find((view) => view.id === user_id);
	const cursor = state.cursors.find((cursor) => cursor.id === user_id);

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
		if (action === 'resize' || action === 'stretchX' || action === 'stretchY' || action === 'rotate') {
			const move = (move_event) => {
				let position = DOMToCanvas(move_event, canvas, view);
				const state = store.getState().present;
				let [, points] = split(state.elements, (element) => element.selected).map((elements) => elements.map((element) => Elements[element.type].points(element)).flat());
				position = roundPoint(position, [] /*[position]*/, points, view);
				const selected_ids = state.elements.filter((element) => element.selected).map((element) => element.id);
				store.dispatch(actions[action]({ user_id: Settings.user.id, id: target.id, position, last_position, selected_ids }));
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
	store.dispatch(actions.createElement({ user_id: Settings.user.id, id: id, type: cursor.type, position: last_position }));

	const move = (move_event) => {
		let position = DOMToCanvas(move_event, canvas, view);
		if (Math.abs(first_position.x - position.x) + Math.abs(first_position.x - position.y) > 10) expanded = true;
		position = roundPoint(position, [position], points, view);
		store.dispatch(actions.resize({ user_id: Settings.user.id, id: id, position, last_position, selected_ids: [id] }));
		last_position = position;
	};
	window.addEventListener('mousemove', move);

	const release = () => {
		if (expanded === false) {
			store.dispatch(
				actions.resize({
					user_id: Settings.user.id,
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
