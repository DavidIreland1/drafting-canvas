import { rotatePoint } from '../../utils/utils';
import Element from './element';

export default class Circle extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Circle',
			type: 'circle',
			x: position.x,
			y: position.y,
			radius: 0,
			start_angle: 0,
			end_angle: 6.283185307179586,
			counter_clockwise: true,
		});
	}

	static points(circle) {
		return [
			{
				x: circle.x,
				y: circle.y,
			},
		];
	}

	static path(circle) {
		const path = new Path2D();
		path.arc(circle.x, circle.y, Math.abs(circle.radius), circle.start_angle, circle.end_angle, circle.counter_clockwise);
		return path;
	}

	static draw(circle, context, cursor, view) {
		context.beginPath();
		const path = this.path(circle);
		this.fill(circle, context, path);
		this.stroke(circle, context, path);
		return context.isPointInPath(path, cursor.x, cursor.y);
	}

	static outline(circle, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.arc(circle.x, circle.y, Math.abs(circle.radius), circle.start_angle, circle.end_angle);
		context.stroke();
	}

	static bound(circle): { x: number; y: number; width: number; height: number } {
		return {
			x: circle.x - circle.radius,
			y: circle.y - circle.radius,
			width: circle.radius * 2,
			height: circle.radius * 2,
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
		ellipse.radius = Math.max(new_position.x - new_opposite.x, new_position.y - new_opposite.y) / 2;
	}
}
