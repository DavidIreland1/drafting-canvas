import { clamp, rotatePoint } from '../../utils/utils';
import Element from './element';

export default class Rectangle extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Rectangle',
			type: 'rectangle',
			rotation: 0,
			points: this.makePoints(position.x, position.y, 1, 1, 0),
		});
	}

	static makePoints(x, y, width, height, radius) {
		return [
			{
				x: x,
				y: y,
				radius: radius,
			},
			{
				x: x + width,
				y: y,
				radius: radius,
			},
			{
				x: x + width,
				y: y + height,
				radius: radius,
			},
			{
				x: x,
				y: y + height,
				radius: radius,
			},
		].map((point, i) => ({ ...point, i }));
	}

	static path(rectangle): Path2D {
		return roundedPoly(new Path2D(), rectangle.points);
	}

	static rotate(rectangle, position, last_position) {
		const center = this.center(rectangle);
		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);
		rectangle.rotation += rotation;
		rectangle.points.forEach((point) => {
			const rotated = rotatePoint(point, center, rotation);
			point.x = rotated.x;
			point.y = rotated.y;
		});
	}

	static stretch(rectangle, position, last_position): void {
		// const center = this.center(rectangle);
		// const bounds = this.bound(rectangle);
		// const opposite = reflectPoint(last_position, center);
		// const new_center = {
		// 	x: (opposite.x + position.x) / 2,
		// 	y: (opposite.y + position.y) / 2,
		// };
		// const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		// const new_position = rotatePoint(position, new_center, -rectangle.rotation);
		// rectangle.x = new_opposite.x;
		// rectangle.y = new_opposite.y;
		// rectangle.width = new_position.x - new_opposite.x;
		// rectangle.height = new_position.y - new_opposite.y;
		// // rectangle.points = this.makePoints(rectangle);
	}
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

function roundedPoly(path, points): Path2D {
	const num_points = points.length;

	points.forEach((last_point, i, points) => {
		const this_point = points[(i + 1) % num_points];
		const next_point = points[(i + 2) % num_points];

		const vector_1 = unitVector(this_point, last_point);
		const vector_2 = unitVector(this_point, next_point);

		const { angle, radius_sign, counter_clockwise } = calculateRadius(vector_1, vector_2);

		const half_angle = angle / 2;
		let length_out = Math.abs((Math.cos(half_angle) * this_point.radius) / Math.sin(half_angle));
		let radius = this_point.radius;

		const min_length = Math.min(vector_1.length, vector_2.length) / 2;

		if (length_out > min_length) {
			length_out = min_length;
			radius = Math.abs((length_out * Math.sin(half_angle)) / Math.cos(half_angle));
		}
		const x = this_point.x + vector_2.x * length_out - vector_2.y * radius * radius_sign;
		const y = this_point.y + vector_2.y * length_out + vector_2.x * radius * radius_sign;
		path.arc(x, y, radius, vector_1.angle + (Math.PI / 2) * radius_sign, vector_2.angle - (Math.PI / 2) * radius_sign, counter_clockwise);
	});
	path.closePath();
	return path;
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

// function getClosest(points, position) {
// 	return points.map((point) => ({ ...point, delta: Math.abs(point.x - position.x) + Math.abs(point.y - position.y) })).sort((point1, point2) => point1.delta + point2.delta)[0];
// }

// function average(arr) {
// 	return arr.reduce((a, b) => a + b, 0) / arr.length;
// }

////////

// const distance = (last_point, this_point) => Math.sqrt((last_point.x - this_point.x) ** 2 + (last_point.y - this_point.y) ** 2);
// const linearInterpolation = (a, b, x) => a + (b - a) * x;
// const linearInterpolation2D = (last_point, this_point, t) => ({
// 	x: linearInterpolation(last_point.x, this_point.x, t),
// 	y: linearInterpolation(last_point.y, this_point.y, t),
// });

// function roundedPoly(points, radius) {
// 	const path = new Path2D();
// 	const num_points = points.length;

// 	points.forEach((last_point, i, points) => {
// 		const this_point = points[(i + 1) % num_points];
// 		const next_point = points[(i + 2) % num_points];

// 		const lastEdgeLength = distance(last_point, this_point);
// 		const lastOffsetDistance = Math.min(lastEdgeLength / 2, radius);
// 		const start = linearInterpolation2D(this_point, last_point, lastOffsetDistance / lastEdgeLength);

// 		const nextEdgeLength = distance(next_point, this_point);
// 		const nextOffsetDistance = Math.min(nextEdgeLength / 2, radius);
// 		const end = linearInterpolation2D(this_point, next_point, nextOffsetDistance / nextEdgeLength);

// 		const control_point = linearInterpolation2D(start, this_point, 1);

// 		path.lineTo(start.x, start.y);
// 		path.quadraticCurveTo(control_point.x, control_point.y, end.x, end.y);
// 	});
// 	path.closePath();

// 	return path;
// }
