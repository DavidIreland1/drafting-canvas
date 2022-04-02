import actions from '../../../redux/slice';
import { DOMToCanvas } from '../../../utils/utils';
import Settings from '../../settings';

const { max_zoom, min_zoom, pan_sensitivity, zoom_sensitivity } = Settings;

export default function onWheel(event: WheelEvent, canvas: HTMLCanvasElement, user_id, store) {
	const state = store.getState().present;
	const view = state.views.find((view) => view.id === user_id);

	if (String(event.deltaY).length < 5) {
		// Pan
		const cursor = state.cursors.find((cursor) => user_id === cursor.id);
		store.dispatch(
			actions.view({
				user_id: user_id,
				delta_x: -event.deltaX * pan_sensitivity,
				delta_y: -event.deltaY * pan_sensitivity,

				cursor_x: cursor.x + (event.deltaX * pan_sensitivity) / view.scale,
				cursor_y: cursor.y + (event.deltaY * pan_sensitivity) / view.scale,
			})
		);
	} else {
		// Zoom
		const delta_scale = event.deltaY * zoom_sensitivity * view.scale;
		if (view.scale - delta_scale < min_zoom) return;
		if (view.scale - delta_scale > max_zoom) return;

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
