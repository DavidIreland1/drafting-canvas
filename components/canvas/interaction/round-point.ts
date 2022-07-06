import { View } from '../../../types/user-types';

export function roundPoint(point, selected_points, points, view: View) {
	if (selected_points.length === 0 || points.length === 0)
		return {
			x: Math.round(point.x),
			y: Math.round(point.y),
		};

	const closest_points = selected_points.map((selected_point) => {
		const closest_x = points.map((point) => ({ ...point, delta: selected_point.x - point.x })).sort((point1, point2) => Math.abs(point1.delta) - Math.abs(point2.delta))[0];
		const closest_y = points.map((point) => ({ ...point, delta: selected_point.y - point.y })).sort((point1, point2) => Math.abs(point1.delta) - Math.abs(point2.delta))[0];
		return {
			x: closest_x.x,
			y: closest_y.y,
			delta_x: closest_x.delta,
			delta_y: closest_y.delta,
		};
	});

	const closest_x = closest_points.sort((point1, point2) => Math.abs(point1.delta_x) - Math.abs(point2.delta_x))[0];
	const closest_y = closest_points.sort((point1, point2) => Math.abs(point1.delta_y) - Math.abs(point2.delta_y))[0];

	const stickiness = 20 / view.scale;

	let x = 0;
	if (Math.abs(closest_x.delta_x) < stickiness) {
		x = point.x - closest_x.delta_x;
	} else {
		x = point.x;
	}

	let y = 0;
	if (Math.abs(closest_y.delta_y) < stickiness) {
		y = point.y - closest_y.delta_y;
	} else {
		y = point.y;
	}

	return {
		x: Math.round(x),
		y: Math.round(y),
	};
}
