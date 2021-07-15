import { onWheel, hover, select } from './interaction';

export function initCanvas(canvas, id, elements_store, views_store, cursors_store, actions) {
	canvas.addEventListener('wheel', (event: WheelEvent) => {
		event.preventDefault();
		onWheel(event, canvas, id, views_store, cursors_store, actions);
	});

	canvas.addEventListener('dblclick', () => {
		const view = views_store.getState().find((view) => view.id === id);
		views_store.dispatch(
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
		const elements = elements_store.getState();
		const views = views_store.getState();
		hover(
			event,
			elements,
			canvas,
			views.find((view) => view.id === id),
			cursors_store,
			actions
		);
	});

	canvas.addEventListener('mouseout', () => {
		cursors_store.dispatch(actions.cursor({ id: id, type: 'none' }));
	});

	canvas.addEventListener('mouseover', () => {
		cursors_store.dispatch(actions.cursor({ id: id, type: 'select' }));
	});

	canvas.addEventListener('mousedown', (event) => {
		if (event.button !== 0) return;
		event.preventDefault();
		const elements = elements_store.getState();
		const views = views_store.getState();
		select(
			event,
			elements,
			canvas,
			views.find((view) => view.id === id),
			elements_store,
			actions
		);
	});

	canvas.addEventListener('mouseover', (event) => {
		event.preventDefault();
		views_store.dispatch(
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
