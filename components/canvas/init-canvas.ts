import { onWheel, hover, select } from './interaction';
import { shortCuts } from './short-cuts';

export function initCanvas(canvas: HTMLCanvasElement, user_id, store, actions, active) {
	canvas.onwheel = (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, user_id, store, actions);
	};

	canvas.focus(); // Needed for react?
	canvas.onkeydown = (event: KeyboardEvent) => {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			event.preventDefault();

			console.log(
				store
					.getState()
					.present.elements.filter((element) => element.selected)
					.map((element) => element.id)
			);
			store.dispatch(
				actions.delete({
					selected_ids: store
						.getState()
						.present.elements.filter((element) => element.selected)
						.map((element) => element.id),
				})
			);
		}

		console.log(event.key);
	};

	canvas.ondblclick = () => {
		if (active.hovering.length) return;

		const view = store.getState().present.views.find((view) => view.id === user_id);

		store.dispatch(
			actions.view({
				user_id: user_id,
				delta_x: canvas.width / 2 - view.x,
				delta_y: canvas.height / 2 - view.y,
				delta_scale: 1 - view.scale,
			})
		);
		// Add cursor movement
	};

	canvas.onpointermove = (event) => {
		hover(event, canvas, store, actions, user_id, active);
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
		event.preventDefault();
		(event.target as any).setPointerCapture(event.pointerId);
		select(event, canvas, user_id, store, actions, active);
	};

	document.onkeydown = async (event) => {
		if (event.metaKey || event.ctrlKey) {
			if (await shortCuts(event, store, actions)) {
				event.preventDefault();
			}
		}
	};
}
