import Element from './element';

export default class Circle extends Element {
	static draw(circle, context, cursor) {
		context.fillStyle = circle.color;
		context.beginPath();
		context.arc(circle.x, circle.y, circle.radius, circle.start_angle, circle.end_angle, circle.counter_clockwise);
		context.fill();
		return context.isPointInPath(cursor.x, cursor.y);
	}

	static outline(circle, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.arc(circle.x, circle.y, circle.radius, circle.start_angle, circle.end_angle);
		context.stroke();
	}

	static collide(circle, position) {
		return (circle.x - position.x) ** 2 + (circle.y - position.y) ** 2 < circle.radius ** 2;
	}

	static bound(circle): { x: number; y: number; width: number; height: number } {
		return {
			x: circle.x - circle.radius,
			y: circle.y - circle.radius,
			width: circle.radius * 2,
			height: circle.radius * 2,
		};
	}

	static resize(ellipse, position, last_position) {
		const delta_x = (position.x - last_position.x) / 2;
		const delta_y = (position.y - last_position.y) / 2;

		const delta = (delta_x + delta_y) / 2;

		ellipse.x += delta;
		ellipse.y += delta;

		const x_direction = Math.sign(last_position.x + delta - ellipse.x);
		const y_direction = Math.sign(last_position.y + delta - ellipse.y);

		ellipse.radius += x_direction * delta;

		ellipse.radius = Math.abs(ellipse.radius);
	}
}
