import actions from '../../redux/slice';
import { hover, singleClick } from './interaction/interaction';
import onWheel from './interaction/wheel';
import shortCuts from './short-cuts';

export default function initCanvas(canvas: HTMLCanvasElement, user_id, store, active) {
	canvas.onwheel = (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, user_id, store);
	};

	canvas.focus(); // Needed for react?
	canvas.onkeydown = async (event: KeyboardEvent) => {
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

		if (await shortCuts(event, store)) {
			event.preventDefault();
		}
	};

	canvas.ondblclick = (event) => {
		if (active.hovering.length) {
			store.dispatch(actions.edit({ id: active.hovering[0].id }));
		} else {
			// Reset view
			const view = store.getState().present.views.find((view) => view.id === user_id);
			store.dispatch(
				actions.view({
					user_id: user_id,
					delta_x: canvas.width / 2 - view.x,
					delta_y: canvas.height / 2 - view.y,
					delta_scale: 1 - view.scale,
				})
			);
		}
	};

	canvas.onpointermove = (event) => {
		hover(event, canvas, store, user_id, active);
	};

	canvas.onpointerout = () => {
		store.dispatch(actions.cursor({ user_id: user_id, visible: false }));
	};

	canvas.onpointerover = () => {
		canvas.focus(); // Needed for react?
		store.dispatch(actions.cursor({ user_id: user_id, visible: true }));
	};

	canvas.onpointerdown = (event) => {
		if (event.button !== 0) return;
		// console.log('single click');
		if (active.selected.length) store.dispatch(actions.cursor({ user_id: user_id, pressed: true }));
		event.preventDefault();
		(event.target as any).setPointerCapture(event.pointerId);
		singleClick(event, canvas, user_id, store, active);
	};

	canvas.onpointerup = () => {
		store.dispatch(actions.cursor({ user_id: user_id, pressed: false }));
	};
}
