import { rotatePoint } from '../../../utils/utils';
import Element from './element';

export default class Polygon extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Polygon',
			type: 'polygon',
			rotation: 0,
			width: 0,
			height: 0,
			radius: 0,
		});
	}

	// static points(polygon) {
	// 	const center = this.center(polygon);

	// 	const sin = Math.sin(polygon.rotation);
	// 	const cos = Math.cos(polygon.rotation);

	// 	return this._points(polygon)
	// 		.map((point) => ({
	// 			x: point.x + polygon.x + polygon.width / 2,
	// 			y: point.y + polygon.y + polygon.height / 2,
	// 		}))
	// 		.map((point) => rotatePoint(point, center, sin, cos))
	// 		.concat(center);
	// }

	// static _points(polygon) {
	// 	return [
	// 		{
	// 			x: -polygon.width / 2,
	// 			y: -polygon.height / 2,
	// 			radius: polygon.radius,
	// 		},
	// 		{
	// 			x: polygon.width / 2,
	// 			y: -polygon.height / 2,
	// 			radius: polygon.radius,
	// 		},
	// 		{
	// 			x: polygon.width / 2,
	// 			y: polygon.height / 2,
	// 			radius: polygon.radius,
	// 		},
	// 		{
	// 			x: -polygon.width / 2,
	// 			y: polygon.height / 2,
	// 			radius: polygon.radius,
	// 		},
	// 	];
	// }

	// static path(polygon) {
	// 	const points = this._points(polygon);

	// 	const delta_x = [0, -1, 0, 1];
	// 	const delta_y = [1, 0, -1, 0];
	// 	const center_x = [1, -1, -1, 1];
	// 	const center_y = [1, 1, -1, -1];

	// 	let angle = Math.PI;
	// 	const delta_angle = Math.PI / 2;

	// 	const path = new Path2D();
	// 	if (polygon.radius.length || polygon.radius > 0) {
	// 		const radius = Math.min(Math.min(Math.abs(polygon.width), Math.abs(polygon.height)) / 2, polygon.radius);

	// 		points.forEach((point, i) => {
	// 			path.lineTo(point.x + radius * delta_x[i], point.y + radius * delta_y[i]);
	// 			path.arc(point.x + radius * center_x[i], point.y + radius * center_y[i], radius, angle, angle + delta_angle);
	// 			angle += delta_angle;
	// 		});
	// 	} else {
	// 		points.forEach((point) => path.lineTo(point.x, point.y));
	// 	}
	// 	path.closePath();

	// 	return path;
	// }

	// static outline(polygon, context, color, line_width): void {
	// 	const center = this.center(polygon);

	// 	context.strokeStyle = color;
	// 	context.lineWidth = line_width;
	// 	context.save();
	// 	context.translate(center.x, center.y);
	// 	context.rotate(polygon.rotation);
	// 	const path = this.path(polygon);
	// 	context.stroke(path);
	// 	context.restore();
	// }

	// static bound(polygon): { x: number; y: number; width: number; height: number } {
	// 	return {
	// 		x: polygon.x,
	// 		y: polygon.y,
	// 		width: polygon.width,
	// 		height: polygon.height,
	// 	};
	// }

	// static resize(polygon, position, last_position): void {
	// 	const center = this.center(polygon);
	// 	const sin = Math.sin(polygon.rotation);
	// 	const cos = Math.cos(polygon.rotation);

	// 	const opposite = {
	// 		x: center.x - (last_position.x - center.x),
	// 		y: center.y - (last_position.y - center.y),
	// 	};

	// 	const new_center = {
	// 		x: (opposite.x + position.x) / 2,
	// 		y: (opposite.y + position.y) / 2,
	// 	};

	// 	const new_opposite = rotatePoint(opposite, new_center, -sin, cos);
	// 	const new_position = rotatePoint(position, new_center, -sin, cos);

	// 	// polygon.x = new_opposite.x;
	// 	polygon.x = new_opposite.x;
	// 	// polygon.y = new_opposite.y)
	// 	polygon.y = new_opposite.y;
	// 	polygon.width = new_position.x - new_opposite.x;
	// 	polygon.height = new_position.y - new_opposite.y;
	// }

	// static stretch(polygon, position, last_position): void {
	// 	const center = this.center(polygon);
	// 	const sin = Math.sin(polygon.rotation);
	// 	const cos = Math.cos(polygon.rotation);

	// 	const opposite = {
	// 		x: center.x - (last_position.x - center.x),
	// 		y: center.y - (last_position.y - center.y),
	// 	};

	// 	const new_center = {
	// 		x: (opposite.x + position.x) / 2,
	// 		y: (opposite.y + position.y) / 2,
	// 	};

	// 	const new_opposite = rotatePoint(opposite, new_center, -sin, cos);
	// 	const new_position = rotatePoint(position, new_center, -sin, cos);

	// 	// polygon.x = new_opposite.x;
	// 	polygon.y = new_opposite.y;
	// 	// polygon.width = new_position.x - new_opposite.x;
	// 	polygon.height = new_position.y - new_opposite.y;
	// }
}
