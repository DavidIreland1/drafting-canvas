import { onWheel, hover, select } from './interaction';

export function initCanvas(canvas: HTMLCanvasElement, id, store, actions) {
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
		const elements = store.getState().elements;
		const views = store.getState().views;
		hover(
			event,
			elements,
			canvas,
			views.find((view) => view.id === id),
			store,
			actions
		);
	});

	canvas.addEventListener('mouseout', () => {
		console.log('mouse out');
		store.dispatch(actions.cursor({ id: id, type: 'none' }));
	});

	canvas.addEventListener('mouseover', () => {
		canvas.focus(); // Needed for react?
		store.dispatch(actions.cursor({ id: id, type: 'select' }));
	});

	canvas.addEventListener('mousedown', (event) => {
		if (event.button !== 0) return;
		event.preventDefault();
		const elements = store.getState().elements;
		const views = store.getState().views;
		select(
			event,
			elements,
			canvas,
			views.find((view) => view.id === id),
			store,
			actions
		);
	});

	document.addEventListener('keydown', (event) => {
		if (event.metaKey || event.ctrlKey) {
			if (shortCuts(event)) {
				event.preventDefault();
			}
		}
	});
}

function shortCuts(event): boolean {
	switch (event.key) {
		case 'c':
			console.log('copy');
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
