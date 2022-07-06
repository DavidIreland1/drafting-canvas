import Settings from '../../settings';
import Elements from '../../canvas/elements/elements';
import move from './move';
import select from './select';
import { DOMToCanvas, split } from '../../../utils/utils';
import { roundPoint } from './round-point';
import actions from '../../../redux/slice';
import movePoints from './move-points';
import create from './create';
import { View } from '../../../types/user-types';

// Needs refactor to use strategy design pattern
export default function mouseDown(down_event, canvas, user_id, store, active) {
	(document.activeElement as any).blur();
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

function applyAction(down_event, last_position, canvas, store, active, view: View) {
	if (active.altering.length > 0) {
		const action = active.altering[0].action;
		const target = active.altering[0].element;
		if (action === 'resize' || action === 'stretchX' || action === 'stretchY' || action === 'rotate') {
			const move = (move_event) => {
				let position = DOMToCanvas(move_event, canvas, view);
				const state = store.getState().present;
				let [, points] = split(state.elements, (element) => element.selected).map((elements) => elements.map((element) => Elements[element.type].points(element)).flat());
				position = roundPoint(position, [position], points, view);
				const selected_ids = state.elements.filter((element) => element.selected).map((element) => element.id);
				store.dispatch(actions[action]({ user_id: Settings.user.id, id: target.id, position, last_position, selected_ids }));
				last_position = position;
			};
			window.addEventListener('mousemove', move);

			const release = () => window.removeEventListener('mousemove', move);
			window.addEventListener('mouseup', release, { once: true });
		} else if (action === 'movePoints') {
			movePoints(canvas, store, view, target, last_position, down_event, active.altering[0].point);
		}
	} else if (active.hovering.length > 0) {
		const target = active.hovering[0];
		move(canvas, store, view, target, last_position, down_event);
	}
}
