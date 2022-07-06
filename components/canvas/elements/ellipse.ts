import { Point } from '../../../types/element-types';
import Element from './element';

export default class Ellipse extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Ellipse',
			type: 'ellipse',
			x: position.x,
			y: position.y,
			rotation: 0,
			// start_angle: 0,
			// end_angle: 6.283185307179586,
		});
	}

	static makePoints(id, x, y, width, height, radius): Array<Point> {
		const kappa = 0.5522848; // Constant to define a ellipse with bezier curves

		const middle_y = y + height / 2;
		const middle_x = x + width / 2;
		const control_x = (width / 2) * kappa; // control point offset horizontal
		const control_y = (height / 2) * kappa; // control point offset horizontal
		return [
			{
				x: x + width,
				y: middle_y,
				radius,
				controls: [
					{ x: x + width, y: middle_y + control_y, selected: false },
					{ x: x + width, y: middle_y - control_y, selected: false },
				],
			},
			{
				x: middle_x,
				y: y + height,
				radius,
				controls: [
					{ x: middle_x - control_x, y: y + height, selected: false },
					{ x: middle_x + control_x, y: y + height, selected: false },
				],
			},
			{
				x: x,
				y: middle_y,
				radius,
				controls: [
					{ x: x, y: middle_y - control_y, selected: false },
					{ x: x, y: middle_y + control_y, selected: false },
				],
			},
			{
				x: middle_x,
				y: y,
				radius,
				controls: [
					{ x: middle_x + control_x, y: y, selected: false },
					{ x: middle_x - control_x, y: y, selected: false },
				],
			},
		].map((point, i) => ({ ...point, id: id + i, selected: false, relation: 'Mirror angle and length' }));
	}

	// TODO: See if we can merge this with rounded poly
	static path(line) {
		const path = new Path2D();
		path.moveTo(line.points[0].x, line.points[0].y);
		line.points.forEach((point, i, points) => {
			const next = points[(i + 1) % line.points.length];
			path.bezierCurveTo(point.controls[0].x, point.controls[0].y, next.controls[1].x, next.controls[1].y, next.x, next.y);
		});
		return path;
	}
}
