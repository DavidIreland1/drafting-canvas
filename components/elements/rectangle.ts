import { rotatePoint } from '../../utils/utils';
import Element from './element';

export default class Rectangle extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Rectangle',
			type: 'rectangle',
			rotation: 0,
			width: 10,
			height: 10,
			radius: 0,
			points: this.makePoints({ ...position, width: 10, height: 10, radius: 0 }),
		});
	}

	static points(rectangle) {
		const center = this.center(rectangle);
		return rectangle.points
			.map((point) => ({
				x: point.x + rectangle.x + rectangle.width / 2,
				y: point.y + rectangle.y + rectangle.height / 2,
			}))
			.map((point) => rotatePoint(point, center, rectangle.rotation))
			.concat(center);
	}

	static makePoints(rectangle) {
		return [
			{
				id: rectangle.id,
				x: 0,
				y: 0,
				// radius: rectangle.radius,
			},
			{
				id: rectangle.id,
				x: rectangle.width,
				y: 0,
				// radius: rectangle.radius,
			},
			{
				id: rectangle.id,
				x: rectangle.width,
				y: rectangle.height,
				// radius: rectangle.radius,
			},
			{
				id: rectangle.id,
				x: 0,
				y: rectangle.height,
				// radius: rectangle.radius,
			},
		].map((point, i) => ({ ...point, i }));
	}

	static path(rectangle) {
		return roundedPoly(rectangle.points, rectangle.radius);
	}

	static draw(rectangle, context: CanvasRenderingContext2D, cursor, view) {
		const center = this.center(rectangle);
		const path = this.path(rectangle);

		context.fillStyle = rectangle.color;

		context.save();
		context.translate(rectangle.x, rectangle.y);
		this.effect(rectangle, context, path, true, view);

		context.rotate(rectangle.rotation);
		this.fill(rectangle, context, path);
		this.effect(rectangle, context, path, false, view);
		this.stroke(rectangle, context, path);

		const hover = context.isPointInPath(path, cursor.x, cursor.y);
		context.restore();

		return hover;
	}

	static outline(rectangle, context, color, line_width): void {
		const center = this.center(rectangle);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.save();
		context.translate(rectangle.x, rectangle.y);
		context.rotate(rectangle.rotation);
		const path = this.path(rectangle);
		context.stroke(path);
		context.restore();
	}

	static bound(rectangle): { x: number; y: number; width: number; height: number } {
		const xs = rectangle.points.map((point) => point.x);
		const ys = rectangle.points.map((point) => point.y);
		const x_min = Math.min(...xs);
		const x_max = Math.max(...xs);
		const y_min = Math.min(...ys);
		const y_max = Math.max(...ys);

		const test = {
			x: x_min + rectangle.x,
			y: y_min + rectangle.y,
			width: x_max - x_min,
			height: y_max - y_min,
		};
		// const test = {
		// 	x: rectangle.x,
		// 	y: rectangle.y,
		// 	width: rectangle.width,
		// 	height: rectangle.height,
		// };
		return test;
	}

	static resize(rectangle, position, last_position): void {
		const center = this.center(rectangle);

		const opposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		const new_position = rotatePoint(position, new_center, -rectangle.rotation);

		const old_width = rectangle.width;
		const old_height = rectangle.height;

		rectangle.x = Math.min(new_position.x, new_opposite.x);
		rectangle.width = Math.abs(new_position.x - new_opposite.x);
		rectangle.y = Math.min(new_position.y, new_opposite.y);
		rectangle.height = Math.abs(new_position.y - new_opposite.y);

		const new_width = rectangle.width;
		const new_height = rectangle.height;

		rectangle.points.forEach((point) => {
			if (old_width === 0 || old_height === 0) return;
			point.x = point.x * (new_width / old_width);
			point.y = point.y * (new_height / old_height);
		});
	}

	static stretch(rectangle, position, last_position): void {
		const center = this.center(rectangle);

		const opposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		const new_position = rotatePoint(position, new_center, -rectangle.rotation);

		// rectangle.x = new_opposite.x;
		rectangle.y = new_opposite.y;
		// rectangle.width = new_position.x - new_opposite.x;
		rectangle.height = new_position.y - new_opposite.y;

		rectangle.points = this.makePoints(rectangle);
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

function roundedPoly(points, radiusAll) {
	const path = new Path2D();

	const num_points = points.length;

	points.forEach((last_point, i, points) => {
		const this_point = points[(i + 1) % num_points];
		const next_point = points[(i + 2) % num_points];

		const vector_1 = unitVector(this_point, last_point);
		const vector_2 = unitVector(this_point, next_point);

		const { angle, radius_sign, counter_clockwise } = calcRadius(vector_1, vector_2);

		const radius = this_point.radius ?? radiusAll;

		const half_angle = angle / 2;
		let length_out = Math.abs((Math.cos(half_angle) * radius) / Math.sin(half_angle));
		let cRadius = radius;

		const min_length = Math.min(vector_1.length, vector_2.length) / 2;

		if (length_out > min_length) {
			length_out = min_length;
			cRadius = Math.abs((length_out * Math.sin(half_angle)) / Math.cos(half_angle));
		}
		const x = this_point.x + vector_2.x * length_out - vector_2.y * cRadius * radius_sign;
		const y = this_point.y + vector_2.y * length_out + vector_2.x * cRadius * radius_sign;
		path.arc(x, y, cRadius, vector_1.angle + (Math.PI / 2) * radius_sign, vector_2.angle - (Math.PI / 2) * radius_sign, counter_clockwise);
	});
	path.closePath();
	return path;
}

function calcRadius(vector_1, vector_2) {
	const sinA00 = vector_1.x * vector_2.y - vector_1.y * vector_2.x;
	const sinA90 = vector_1.x * vector_2.x + vector_1.y * vector_2.y;

	const angle = Math.asin(sinA00 < -1 ? -1 : sinA00 > 1 ? 1 : sinA00);

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

function getClosest(points, position) {
	return points.map((point) => ({ ...point, delta: Math.abs(point.x - position.x) + Math.abs(point.y - position.y) })).sort((point1, point2) => point1.delta + point2.delta)[0];
}

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
