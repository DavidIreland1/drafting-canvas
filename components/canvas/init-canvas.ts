import { onWheel, hover, select } from './interaction';
import { shortCuts } from './short-cuts';

export function initCanvas(canvas: HTMLCanvasElement, id, store, actions, active) {
	// canvas.outerHTML = canvas.outerHTML;

	canvas.onwheel = null;
	canvas.addEventListener('wheel', (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, id, store, actions);
	});

	canvas.focus(); // Needed for react?
	canvas.onkeydown = null;
	canvas.addEventListener('keydown', (event: KeyboardEvent) => {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			event.preventDefault();
			store.dispatch(actions.deleteSelected());
		}
	});

	canvas.ondblclick = null;
	canvas.addEventListener('dblclick', () => {
		if (active.hovering.length) return;

		const view = store.getState().present.views.find((view) => view.id === id);

		store.dispatch(
			actions.view({
				id: id,
				delta_x: canvas.width / 2 - view.x,
				delta_y: canvas.height / 2 - view.y,
				delta_scale: 1 - view.scale,
			})
		);
		// Add cursor movement
	});

	canvas.onpointermove = null;
	canvas.addEventListener('pointermove', (event) => {
		hover(event, canvas, store, actions, id, active);
	});

	canvas.onpointerout = null;
	canvas.addEventListener('pointerout', () => {
		store.dispatch(actions.cursor({ id: id, visible: false }));
	});

	canvas.onpointerover = null;
	canvas.addEventListener('pointerover', () => {
		canvas.focus(); // Needed for react?
		store.dispatch(actions.cursor({ id: id, visible: true }));
	});

	canvas.onpointerdown = null;
	canvas.addEventListener('pointerdown', (event) => {
		if (event.button !== 0) return;
		event.preventDefault();
		(event.target as any).setPointerCapture(event.pointerId);
		select(event, canvas, id, store, actions, active);
	});

	canvas.onkeydown = null;
	document.addEventListener('keydown', (event) => {
		if (event.metaKey || event.ctrlKey) {
			if (shortCuts(event, store, actions)) {
				event.preventDefault();
			}
		}
	});
}
