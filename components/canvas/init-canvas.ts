import { ActionCreators } from 'redux-undo';
import { onWheel, hover, select } from './interaction';

export function initCanvas(canvas: HTMLCanvasElement, id, store, actions, active) {
	canvas.addEventListener('wheel', (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, id, store, actions);
	});

	canvas.focus(); // Needed for react?
	canvas.addEventListener('keydown', (event: KeyboardEvent) => {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			event.preventDefault();
			store.dispatch(actions.deleteSelected());
		}
	});

	canvas.addEventListener('dblclick', () => {
		if (active.hovering.length) return;

		const view = store.getState().views.find((view) => view.id === id);
		store.dispatch(
			actions.view({
				id: id,
				delta_x: -view.x,
				delta_y: -view.y,
				delta_scale: 1 - view.scale,
			})
		);
		// Add cursor movement
	});

	canvas.addEventListener('mousemove', (event) => {
		hover(event, canvas, store, actions, id, active);
	});

	canvas.addEventListener('mouseout', () => {
		store.dispatch(actions.cursor({ id: id, visible: false }));
	});

	canvas.addEventListener('mouseover', () => {
		canvas.focus(); // Needed for react?
		store.dispatch(actions.cursor({ id: id, visible: true }));
	});

	canvas.addEventListener('mousedown', (event) => {
		if (event.button !== 0) return;
		event.preventDefault();
		select(event, canvas, id, store, actions, active);
	});

	document.addEventListener('keydown', (event) => {
		if (event.metaKey || event.ctrlKey) {
			if (shortCuts(event, store)) {
				event.preventDefault();
			}
		}
	});
}

function shortCuts(event, store): boolean {
	switch (event.key) {
		// case 'c':
		// 	console.log('copy');
		// 	return true;

		case 'z':
			if (store.getState().past.length > 1) store.dispatch(ActionCreators.undo());
			return true;

		case 'y':
			store.dispatch(ActionCreators.redo());
			return true;
		case 'v':
			console.log('paste');
			return true;
		case 's':
			event.preventDefault();
			console.log('save');
			return true;
	}
	return false;
}
