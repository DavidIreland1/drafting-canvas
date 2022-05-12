import actions from '../../redux/slice';
import drop from './interaction/drop';
import { hover, singleClick } from './interaction/interaction';
import onWheel from './interaction/wheel';
import shortCuts from './short-cuts';

export default function initCanvas(canvas: HTMLCanvasElement, user_id, store, active) {
	canvas.onwheel = (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, user_id, store);
	};

	canvas.focus(); // Needed for react?
	canvas.onkeydown = (event: KeyboardEvent) => {
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

		if (shortCuts(event, store)) {
			event.preventDefault();
		}
	};

	canvas.ondblclick = () => {
		if (active.hovering.length) {
			store.dispatch(actions.editOnly({ id: active.hovering[0].id }));
		} else {
			// Reset view
			// const view = store.getState().present.views.find((view) => view.id === user_id);
			// store.dispatch(
			// 	actions.view({
			// 		user_id: user_id,
			// 		delta_x: canvas.width / 2 - view.x,
			// 		delta_y: canvas.height / 2 - view.y,
			// 		delta_scale: 1 - view.scale,
			// 	})
			// );
		}
	};

	canvas.ondragover = (event) => {
		event.preventDefault();
		canvas.classList.add('dragging');
	};

	canvas.ondrop = (event: any) => {
		drop(event, canvas, store, user_id);
	};

	canvas.onmousemove = (event) => {
		hover(event, canvas, store, user_id, active);
	};

	canvas.onmouseout = () => {
		store.dispatch(actions.cursor({ user_id: user_id, visible: false }));
	};

	canvas.onmouseover = () => {
		canvas.focus(); // Needed for react?
		store.dispatch(actions.cursor({ user_id: user_id, visible: true }));
	};

	canvas.onmousedown = (event) => {
		if (event.button !== 0) return;
		if (active.selected.length) store.dispatch(actions.cursor({ user_id: user_id, pressed: true }));
		event.preventDefault();
		singleClick(event, canvas, user_id, store, active);
	};

	canvas.onmouseup = () => {
		store.dispatch(actions.cursor({ user_id: user_id, pressed: false }));
	};
}
