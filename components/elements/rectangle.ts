import Element from './element';

export default class Rectangle extends Element {
	static draw(rectangle, context: CanvasRenderingContext2D, cursor) {
		context.fillStyle = rectangle.color;

		const center = this.center(rectangle);

		context.translate(center.x, center.y);
		context.rotate(rectangle.rotation);
		context.beginPath();
		context.rect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);
		context.fill();
		context.rotate(-rectangle.rotation);
		context.translate(-center.x, -center.y);
		return context.isPointInPath(cursor.x, cursor.y);
	}

	static outline(rectangle, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;

		const center = this.center(rectangle);
		context.translate(center.x, center.y);
		context.rotate(rectangle.rotation);
		context.beginPath();
		context.rect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);
		context.stroke();
		context.rotate(-rectangle.rotation);
		context.translate(-center.x, -center.y);
	}

	static collide(rectangle, position): boolean {
		position = this.rotatePoint(position, this.center(rectangle), -rectangle.rotation);
		return rectangle.x < position.x && position.x < rectangle.x + rectangle.width && rectangle.y < position.y && position.y < rectangle.y + rectangle.height;
	}

	static bound(rectangle): { x: number; y: number; width: number; height: number } {
		return {
			x: rectangle.x,
			y: rectangle.y,
			width: rectangle.width,
			height: rectangle.height,
		};
	}

	// static resize(rectangle, position, last_position, direction_x, direction_y): void {
	// 	const delta_x = (position.x - last_position.x) / 2;
	// 	const delta_y = (position.y - last_position.y) / 2;

	// 	rectangle.x += delta_x / 2;
	// 	rectangle.y += delta_y / 2;

	// 	rectangle.width += direction_x * delta_x;
	// 	rectangle.height += direction_y * delta_y;

	// 	rectangle.width = Math.abs(rectangle.width);
	// 	rectangle.height = Math.abs(rectangle.height);
	// }

	static resize(rectangle, position, last_position, direction_x, direction_y): void {
		const delta_x = (position.x - last_position.x) / 2;
		const delta_y = (position.y - last_position.y) / 2;

		const center = this.center(rectangle);

		const top_left = rotatePoint(rectangle, center, rectangle.rotation);

		const newCenter = {
			x: (top_left.x + position.x) / 2,
			y: (top_left.y + position.y) / 2,
		};

		const new_top_left = rotatePoint(top_left, newCenter, -rectangle.rotation);
		const new_bottom_right = rotatePoint(position, newCenter, -rectangle.rotation);

		rectangle.x = new_top_left.x;
		rectangle.y = new_top_left.y;
		rectangle.width = new_bottom_right.x - new_top_left.x;
		rectangle.height = new_bottom_right.y - new_top_left.y;
	}
}

function rotatePoint(position, center, rotation) {
	return {
		x: (position.x - center.x) * Math.cos(rotation) - (position.y - center.y) * Math.sin(rotation) + center.x,
		y: (position.x - center.x) * Math.sin(rotation) + (position.y - center.y) * Math.cos(rotation) + center.y,
	};
}
