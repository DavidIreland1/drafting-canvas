import { onWheel, hover, select } from './interaction';

export function initCanvas(canvas, id, store, actions) {
	canvas.addEventListener('wheel', (event: WheelEvent) => {
		event.preventDefault();
		const view = store.getState().views.find((view) => view.id === id);
		onWheel(event, canvas, view, store, actions);
	});

	canvas.addEventListener('dblclick', (event) => {
		event.preventDefault();
		const view = store.getState().views.find((view) => view.id === id);
		store.dispatch(
			actions.view({
				id: id,
				delta_x: -view.x,
				delta_y: -view.y,
				delta_scale: 1 - view.scale,
			})
		);
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

	document.addEventListener('keydown', (event) => {
		if (event.metaKey || event.ctrlKey) {
			shortCuts(event);
		}
	});
}

function shortCuts(event) {
	switch (event.key) {
		case 'c':
			console.log('copy');
			break;
		case 'v':
			console.log('paste');
			break;
		case 's':
			event.preventDefault();
			console.log('save');
			break;
	}
}
