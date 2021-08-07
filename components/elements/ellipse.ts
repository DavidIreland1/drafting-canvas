import Element from './element';

export default class Ellipse extends Element {
	static draw(ellipse, context: CanvasRenderingContext2D, cursor) {
		context.beginPath();
		context.ellipse(ellipse.x, ellipse.y, Math.abs(ellipse.radius_x), Math.abs(ellipse.radius_y), ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
		this.fill(ellipse, context);
		this.stroke(ellipse, context);
		return context.isPointInPath(cursor.x, cursor.y);
	}

	static outline(ellipse, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.ellipse(ellipse.x, ellipse.y, Math.abs(ellipse.radius_x), Math.abs(ellipse.radius_y), ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
		context.stroke();
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

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -ellipse.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -ellipse.rotation);

		ellipse.x = new_center.x;
		ellipse.y = new_center.y;
		ellipse.radius_x = (new_poistion.x - new_oposite.x) / 2;
		ellipse.radius_y = (new_poistion.y - new_oposite.y) / 2;
	}
}
