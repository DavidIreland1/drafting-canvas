import { rotatePoint } from '../../utils/utils';
import Element from './element';

export default class Ellipse extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Ellipse',
			type: 'ellipse',
			x: position.x,
			y: position.y,
			radius_x: 0,
			radius_y: 0,
			rotation: 0,
			start_angle: 0,
			end_angle: 6.283185307179586,
		});
	}

	static points(ellipse) {
		const center = this.center(ellipse);
		return [
			{
				x: ellipse.x,
				y: ellipse.y,
			},
			{
				x: ellipse.x - ellipse.radius_x,
				y: ellipse.y - ellipse.radius_y,
			},
			{
				x: ellipse.x - ellipse.radius_x,
				y: ellipse.y + ellipse.radius_y,
			},
			{
				x: ellipse.x + ellipse.radius_x,
				y: ellipse.y - ellipse.radius_y,
			},
			{
				x: ellipse.x + ellipse.radius_x,
				y: ellipse.y + ellipse.radius_y,
			},
		].map((point) => rotatePoint(point, center, ellipse.rotation));
	}

	static path(ellipse) {
		const path = new Path2D();
		path.ellipse(ellipse.x, ellipse.y, Math.abs(ellipse.radius_x), Math.abs(ellipse.radius_y), ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
		return path;
	}

	static draw(ellipse, context: CanvasRenderingContext2D, cursor, view) {
		context.beginPath();
		const path = this.path(ellipse);

		this.effect(ellipse, context, path, true, view);
		this.fill(ellipse, context, path);
		this.effect(ellipse, context, path, false, view);
		this.stroke(ellipse, context, path);

		// context.shadowColor = 'transparent';
		return context.isPointInPath(path, cursor.x, cursor.y);
	}

	static outline(ellipse, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		const path = this.path(ellipse);
		context.stroke(path);
	}

	static center(ellipse) {
		return {
			x: ellipse.x,
			y: ellipse.y,
		};
	}

	static bound(ellipse): { x: number; y: number; width: number; height: number } {
		return {
			x: ellipse.x - ellipse.radius_x,
			y: ellipse.y - ellipse.radius_y,
			width: ellipse.radius_x * 2,
			height: ellipse.radius_y * 2,
		};
	}

	static resize(ellipse, position, last_position): void {
		const center = this.center(ellipse);

		const opposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -ellipse.rotation);
		const new_position = rotatePoint(position, new_center, -ellipse.rotation);

		ellipse.x = new_center.x;
		ellipse.y = new_center.y;
		ellipse.radius_x = (new_position.x - new_opposite.x) / 2;
		ellipse.radius_y = (new_position.y - new_opposite.y) / 2;
	}
}
