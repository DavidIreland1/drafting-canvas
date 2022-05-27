import actions from '../../../redux/slice';
import { clamp, DOMToCanvas } from '../../../utils/utils';
import Settings from '../../settings';

const { zoom, pan } = Settings;

export default function wheel(event: WheelEvent, canvas: HTMLCanvasElement, user_id, store) {
	event.preventDefault();
	const state = store.getState().present;
	const view = state.views.find((view) => view.id === user_id);

	if (String(event.deltaY).length < 5 && !event.metaKey) {
		// Pan
		const cursor = state.cursors.find((cursor) => user_id === cursor.id);

		const delta_x = event.deltaX * pan.sensitivity;
		const delta_y = event.deltaY * pan.sensitivity;

		store.dispatch(
			actions.view({
				user_id: user_id,
				delta_x: -delta_x,
				delta_y: -delta_y,
				cursor_x: cursor.x + delta_x / view.scale,
				cursor_y: cursor.y + delta_y / view.scale,
			})
		);
	} else {
		// Zoom
		const delta_scale = clamp(view.scale - zoom.max, event.deltaY * zoom.sensitivity * view.scale * (event.metaKey ? 0.1 : 1), view.scale - zoom.min);

		const position = DOMToCanvas(event, canvas, view);
		store.dispatch(
			actions.view({
				user_id: user_id,
				delta_x: position.x * delta_scale,
				delta_y: position.y * delta_scale,
				delta_scale: -delta_scale,
			})
		);
	}
}
