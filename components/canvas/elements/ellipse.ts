import Element from './element';

export default class Ellipse extends Element {
	static draw(ellipse, context: CanvasRenderingContext2D) {
		context.fillStyle = ellipse.color;
		context.beginPath();
		context.ellipse(ellipse.x, ellipse.y, ellipse.radius_x, ellipse.radius_y, ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
		context.fill();
	}

	static outline(ellipse, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.ellipse(ellipse.x, ellipse.y, ellipse.radius_x, ellipse.radius_y, ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
		context.stroke();
	}

	static collide(ellipse, position) {
		return (ellipse.x - position.x) ** 2 / ellipse.radius_x ** 2 + (ellipse.y - position.y) ** 2 / ellipse.radius_y ** 2 < 1;
	}

	static bound(ellipse): { x: number; y: number; width: number; height: number } {
		return {
			x: ellipse.x - ellipse.radius_x,
			y: ellipse.y - ellipse.radius_y,
			width: ellipse.radius_x * 2,
			height: ellipse.radius_y * 2,
		};
	}

	static resize(ellipse, position, last_position) {
		const delta_x = (position.x - last_position.x) / 2;
		const delta_y = (position.y - last_position.y) / 2;

		ellipse.x += delta_x;
		ellipse.y += delta_y;

		const x_direction = Math.sign(last_position.x + delta_x - ellipse.x);
		const y_direction = Math.sign(last_position.y + delta_y - ellipse.y);

		ellipse.radius_x += x_direction * delta_x;
		ellipse.radius_y += y_direction * delta_y;

		ellipse.radius_x = Math.abs(ellipse.radius_x);
		ellipse.radius_y = Math.abs(ellipse.radius_y);
	}
}
