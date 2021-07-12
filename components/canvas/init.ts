import { onWheel, hover, select } from './interaction';

export function initCanvas(canvas, id, store, actions) {
	canvas.addEventListener('wheel', (event: WheelEvent) => {
		event.preventDefault();
		const view = store.getState().views.find((view) => view.id === id);
		onWheel(event, canvas, view, store, actions);
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
		const { elements, views } = store.getState();
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
		store.dispatch(actions.cursor({ id: id, type: 'none' }));
	});

	canvas.addEventListener('mouseover', () => {
		store.dispatch(actions.cursor({ id: id, type: 'select' }));
	});

	canvas.addEventListener('mousedown', (event) => {
		if (event.button !== 0) return;
		event.preventDefault();
		const { elements, views } = store.getState();
		select(
			event,
			elements,
			canvas,
			views.find((view) => view.id === id),
			store,
			actions
		);
	});

	canvas.addEventListener('mouseover', (event) => {
		event.preventDefault();
		store.dispatch(
			actions.view({
				id: '123',
				delta_x: -event.deltaX,
				delta_y: -event.deltaY,
			})
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
