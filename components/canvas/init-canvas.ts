import actions from '../../redux/slice';
import drop from './interaction/drop';
import mousedown from './interaction/mousedown';
import hover from './interaction/hover';
import wheel from './interaction/wheel';
import shortCuts from './short-cuts';

import { touchstart, touchmove, touchend } from './touch/touch';

export default function initCanvas(canvas: HTMLCanvasElement, user_id, store, active) {
	canvas.focus(); // Needed for react?
	const keyDown = (event: KeyboardEvent) => {
		if (document.activeElement !== document.body) return;
		if (event.key === 'Delete' || event.key === 'Backspace') {
			event.preventDefault();
			store.dispatch(
				actions.delete({
					selected_ids: store
						.getState()
						.present.elements.filter((element) => element.selected)
						.map((element) => element.id),
				})
			);
		}
		if (shortCuts(event, store)) event.preventDefault();
	};
	document.body.addEventListener('keydown', keyDown);

	const events = {
		wheel: (event) => wheel(event, canvas, user_id, store),
		drop: (event) => drop(event, canvas, store, user_id),
		mouseover: () => store.dispatch(actions.cursor({ user_id, visible: true })),
		mousedown: (event) => mousedown(event, canvas, user_id, store, active),
		mousemove: (event) => hover(event, canvas, store, user_id, active),
		mouseup: () => store.dispatch(actions.cursor({ user_id, pressed: false })),
		mouseout: () => store.dispatch(actions.cursor({ user_id, visible: false })),
		dblclick: () => active.hovering.length && store.dispatch(actions.editOnly({ id: active.hovering[0].id })),

		touchstart: (event) => touchstart(event, canvas, store, user_id),
		touchmove: (event) => touchmove(event, canvas, store, user_id),
		touchend: (event) => touchend(event, canvas, store, user_id),
	};
	Object.entries(events).forEach(([type, event]) => canvas.addEventListener(type, event));

	return () => {
		document.body.removeEventListener('keydown', keyDown);
		Object.entries(events).forEach(([type, event]) => canvas.removeEventListener(type, event));
	};
}

// Reset view example
// const view = store.getState().present.views.find((view) => view.id === user_id);
// store.dispatch(
// 	actions.view({
// 		user_id: user_id,
// 		delta_x: canvas.width / 2 - view.x,
// 		delta_y: canvas.height / 2 - view.y,
// 		delta_scale: 1 - view.scale,
// 	})
// );
