import Element from './element';

export default class Rectangle extends Element {
	static draw(rectangle, context: CanvasRenderingContext2D): void {
		context.fillStyle = rectangle.color;

		const center = this.center(rectangle);

		context.translate(center.x, center.y);
		context.rotate(rectangle.rotation);
		context.beginPath();
		context.rect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);
		context.fill();
		context.rotate(-rectangle.rotation);
		context.translate(-center.x, -center.y);
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

	static resize(rectangle, position, last_position, direction_x, direction_y): void {
		const delta_x = (position.x - last_position.x) / 2;
		const delta_y = (position.y - last_position.y) / 2;

		rectangle.x += delta_x / 2;
		rectangle.y += delta_y / 2;

		rectangle.width += direction_x * delta_x;
		rectangle.height += direction_y * delta_y;

		rectangle.width = Math.abs(rectangle.width);
		rectangle.height = Math.abs(rectangle.height);
	}
}
