import { clamp, DOMToCanvas } from '../../../utils/utils';
import actions from '../../../redux/slice';
import Settings from '../../settings';

const { zoom } = Settings;

let last_position = null;
let last_distance = null;
let last_center = null;

export function touchstart(event, canvas, store, user_id) {
	event.preventDefault();
	canvas.style.cursor = 'none';

	const view = store.getState().present.views.find((view) => view.id === user_id);
	// const points = Array.from(event.touches).map((touch: Touch) => DOMToCanvas({ x: touch.clientX, y: touch.clientY }, canvas, view));
	const points = Array.from(event.touches).map((touch: Touch) => ({ x: touch.clientX, y: touch.clientY }));
	if (points.length === 1) {
		last_position = points[0];
	} else if (points.length > 1) {
		last_distance = (points[0].x - points[1].x) ** 2 + (points[0].y - points[1].y) ** 2;
	}
}

export function touchend(event, canvas, store, user_id) {
	event.preventDefault();
	canvas.style.cursor = undefined;
	last_position = null;
	last_distance = null;
	last_center = null;
}

export function touchmove(event: TouchEvent, canvas: HTMLCanvasElement, store, user_id) {
	event.preventDefault();
	const points = Array.from(event.touches).map((touch: Touch) => ({ x: touch.clientX, y: touch.clientY }));

	if (points.length === 1) {
		if (last_position !== null) {
			store.dispatch(
				actions.view({
					user_id,
					delta_x: (points[0].x - last_position.x) * window.devicePixelRatio,
					delta_y: (points[0].y - last_position.y) * window.devicePixelRatio,
				})
			);
		}
		last_position = points[0];
	} else if (points.length > 1) {
		const view = store.getState().present.views.find((view) => view.id === user_id);

		const distance = (points[0].x - points[1].x) ** 2 + (points[0].y - points[1].y) ** 2;

		const center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };

		const canvas_center = DOMToCanvas(center, canvas, view);

		const delta_scale = clamp(view.scale - zoom.max, 0.000008 * (distance - last_distance) * view.scale, view.scale - zoom.min);

		if (last_distance !== null && last_center !== null) {
			store.dispatch(
				actions.view({
					user_id,
					delta_x: -canvas_center.x * delta_scale + (center.x - last_center.x) * window.devicePixelRatio,
					delta_y: -canvas_center.y * delta_scale + (center.y - last_center.y) * window.devicePixelRatio,
					delta_scale: delta_scale,
				})
			);
		}
		last_distance = distance;
		last_center = center;
	}
}
