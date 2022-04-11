import { clamp } from '../../utils/utils';

export default function roundedPoly(points): Path2D {
	const path = new Path2D();

	points.forEach((point, i, points) => {
		if (point.radius === 0) return path.lineTo(point.x, point.y);
		const last_point = points[(i - 1 + points.length) % points.length];
		const next_point = points[(i + 1) % points.length];

		const vector_1 = unitVector(point, last_point);
		const vector_2 = unitVector(point, next_point);

		const { angle, radius_sign, counter_clockwise } = calculateRadius(vector_1, vector_2);

		const half_angle = angle / 2;
		let length_out = Math.abs((Math.cos(half_angle) * point.radius) / Math.sin(half_angle));
		let radius = point.radius;

		const min_length = Math.min(vector_1.length, vector_2.length) / 2;

		if (length_out > min_length) {
			length_out = min_length;
			radius = Math.abs((length_out * Math.sin(half_angle)) / Math.cos(half_angle));
		}
		const x = point.x + vector_2.x * length_out - vector_2.y * radius * radius_sign;
		const y = point.y + vector_2.y * length_out + vector_2.x * radius * radius_sign;
		path.arc(x, y, radius, vector_1.angle + (Math.PI / 2) * radius_sign, vector_2.angle - (Math.PI / 2) * radius_sign, counter_clockwise);
	});
	path.closePath();
	return path;
}

function unitVector(point1, point2) {
	const delta_x = point2.x - point1.x;
	const delta_y = point2.y - point1.y;
	const length = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
	return {
		x: delta_x / length,
		y: delta_y / length,
		angle: Math.atan2(delta_y, delta_x),
		length,
	};
}

function calculateRadius(vector_1, vector_2) {
	const sinA00 = vector_1.x * vector_2.y - vector_1.y * vector_2.x;
	const sinA90 = vector_1.x * vector_2.x + vector_1.y * vector_2.y;

	const angle = Math.asin(clamp(-1, sinA00, 1));

	if (sinA90 < 0) {
		if (angle < 0) {
			return {
				angle: angle + Math.PI,
				radius_sign: 1,
				counter_clockwise: false,
			};
		} else {
			return {
				angle: angle - Math.PI,
				radius_sign: -1,
				counter_clockwise: true,
			};
		}
	}
	if (angle < 0) {
		return {
			angle: angle,
			radius_sign: 1,
			counter_clockwise: false,
		};
	} else {
		return {
			angle: angle,
			radius_sign: -1,
			counter_clockwise: true,
		};
	}
}
