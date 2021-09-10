import Element from './element';

export default class Circle extends Element {
	static create(id, position) {
		return Object.assign(super.create(id, position), {
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

	static draw(circle, context, cursor) {
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
		ellipse.radius = Math.max(new_poistion.x - new_oposite.x, new_poistion.y - new_oposite.y) / 2;
	}
}
