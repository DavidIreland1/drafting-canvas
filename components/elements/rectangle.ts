import { Bound, Position } from '../../types/box-types';
import { ElementType } from '../../types/element-types';
import { clamp, rotatePoint } from '../../utils/utils';
import Element from './element';

export default class Rectangle extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Rectangle',
			type: 'rectangle',
			rotation: 0,
			radius: 0,
			points: this.makePoints({ ...position, width: 1, height: 1, radius: 0 }),
		});
	}

	static points(rectangle) {
		return rectangle.points.concat(this.center(rectangle));
	}

	static makePoints(rectangle) {
		return [
			{
				x: rectangle.x, //-rectangle.width / 2,
				y: rectangle.y, //-rectangle.height / 2,
				// radius: rectangle.radius,
			},
			{
				x: rectangle.x + rectangle.width, // / 2,
				y: rectangle.y, //-rectangle.height / 2,
				// radius: rectangle.radius,
			},
			{
				x: rectangle.x + rectangle.width, // / 2,
				y: rectangle.y + rectangle.height, // / 2,
				// radius: rectangle.radius,
			},
			{
				x: rectangle.x, //-rectangle.width / 2,
				y: rectangle.y + rectangle.height, // / 2,
				// radius: rectangle.radius,
			},
		].map((point, i) => ({ ...point, i }));
	}

	static path(rectangle): Path2D {
		const path = new Path2D();
		return roundedPoly(path, rectangle.points, rectangle.radius);
	}

	static draw(rectangle, context: CanvasRenderingContext2D, cursor, view) {
		const path = this.path(rectangle);
		this.effect(rectangle, context, path, true, view);
		this.fill(rectangle, context, path);
		this.effect(rectangle, context, path, false, view);
		this.stroke(rectangle, context, path);
		return context.isPointInPath(path, cursor.x, cursor.y);
	}

	static outline(rectangle, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		const path = this.path(rectangle);
		context.stroke(path);
	}

	static centroid(rectangle: ElementType): Position {
		return {
			x: average(rectangle.points.map((point) => point.x)),
			y: average(rectangle.points.map((point) => point.y)),
		};
	}

	static center(rectangle: ElementType): Position {
		const points = rectangle.points.map((point) => rotatePoint(point, { x: 0, y: 0 }, -rectangle.rotation));
		const xs = points.map((point) => point.x);
		const ys = points.map((point) => point.y);
		const x_min = Math.min(...xs);
		const x_max = Math.max(...xs);
		const y_min = Math.min(...ys);
		const y_max = Math.max(...ys);

		return rotatePoint(
			{
				x: x_min + (x_max - x_min) / 2,
				y: y_min + (y_max - y_min) / 2,
			},
			{ x: 0, y: 0 },
			rectangle.rotation
		);
	}

	static bound(rectangle: ElementType): Bound {
		const center = this.center(rectangle);

		const points = rectangle.points.map((point) => rotatePoint(point, center, -rectangle.rotation));

		const xs = points.map((point) => point.x);
		const ys = points.map((point) => point.y);
		const x_min = Math.min(...xs);
		const x_max = Math.max(...xs);
		const y_min = Math.min(...ys);
		const y_max = Math.max(...ys);

		return {
			x: x_min,
			y: y_min,
			width: x_max - x_min,
			height: y_max - y_min,
		};
	}

	static rotate(rectangle, position, last_position) {
		const center = this.center(rectangle);
		console.log(center);
		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);
		rectangle.rotation += rotation;

		rectangle.points.forEach((point) => {
			const rotated = rotatePoint(point, center, rotation);
			point.x = rotated.x;
			point.y = rotated.y;
		});
	}

	static move(element, position, last_position) {
		const delta_x = position.x - last_position.x;
		const delta_y = position.y - last_position.y;
		element.points.forEach((point) => {
			point.x += delta_x;
			point.y += delta_y;
		});
	}

	static resize(rectangle, position, last_position): void {
		const center = this.center(rectangle);
		const bounds = this.bound(rectangle);

		if (bounds.width === 0 || bounds.height === 0) return; // This might be an issue

		// Find opposite corner
		const opposite = reflectPoint(last_position, center);

		// Rotate all points to 0 deg
		const new_opposite = rotatePoint(opposite, center, -rectangle.rotation);
		const new_position = rotatePoint(position, center, -rectangle.rotation);
		rectangle.points.forEach((point) => {
			const rotated = rotatePoint(point, center, -rectangle.rotation);
			point.x = rotated.x;
			point.y = rotated.y;
		});

		// Get change ratio in width and height
		const width_ratio = Math.abs(new_position.x - new_opposite.x) / bounds.width;
		const height_ratio = Math.abs(new_position.y - new_opposite.y) / bounds.height;

		// Top left of bounding box
		const x_min_old = Math.min(...rectangle.points.map((point) => point.x));
		const y_min_old = Math.min(...rectangle.points.map((point) => point.y));

		// Top left of resize box
		const x_min_new = Math.min(new_opposite.x, new_position.x);
		const y_min_new = Math.min(new_opposite.y, new_position.y);

		// Scale point positions
		rectangle.points.forEach((point) => {
			point.x = (point.x - x_min_old) * width_ratio + x_min_new;
			point.y = (point.y - y_min_old) * height_ratio + y_min_new;
		});

		// Rotate points back
		rectangle.points.forEach((point) => {
			const rotated = rotatePoint(point, center, rectangle.rotation);
			point.x = rotated.x;
			point.y = rotated.y;
		});
	}

	static stretch(rectangle, position, last_position): void {
		const center = this.center(rectangle);

		const opposite = reflectPoint(last_position, center);

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		const new_position = rotatePoint(position, new_center, -rectangle.rotation);

		rectangle.x = new_opposite.x;
		rectangle.y = new_opposite.y;
		rectangle.width = new_position.x - new_opposite.x;
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

function roundedPoly(path, points, radiusAll): Path2D {
	const num_points = points.length;

	points.forEach((last_point, i, points) => {
		const this_point = points[(i + 1) % num_points];
		const next_point = points[(i + 2) % num_points];

		const vector_1 = unitVector(this_point, last_point);
		const vector_2 = unitVector(this_point, next_point);

		const { angle, radius_sign, counter_clockwise } = calculateRadius(vector_1, vector_2);

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

function getClosest(points, position) {
	return points.map((point) => ({ ...point, delta: Math.abs(point.x - position.x) + Math.abs(point.y - position.y) })).sort((point1, point2) => point1.delta + point2.delta)[0];
}

function reflectPoint(point, reflect) {
	return {
		x: reflect.x - (point.x - reflect.x),
		y: reflect.y - (point.y - reflect.y),
	};
}

function average(arr) {
	return arr.reduce((a, b) => a + b, 0) / arr.length;
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
