// import Defaults from './../../defaults';
// const { line_width, box_size, highlight_color } = Defaults;

export default class Element {
	static draw(element, context): void {
		return;
	}

	static resize(element, position, last_position, direction_x, direction_y): void {
		return;
	}

	static collide(element, position): boolean {
		return false;
	}

	static outline(element, context: CanvasRenderingContext2D, color: string, line_width: number): void {
		return;
	}

	static highlight(element, context: CanvasRenderingContext2D, color: string, line_width: number, box_size: number): void {
		this.outline(element, context, color, line_width);

		const bounds = this.bound(element);
		const center = this.center(element);

		context.translate(center.x, center.y);
		context.rotate(element.rotation);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		context.stroke();

		if (bounds.width + bounds.height > box_size * 4) {
			bounds.x = -bounds.width / 2;
			bounds.y = -bounds.height / 2;
			this.boxes(element.id, bounds, box_size).forEach((square) => {
				this.drawSquare(square, context, color, line_width);
			});
		}

		context.rotate(-element.rotation);
		context.translate(-center.x, -center.y);
	}

	static center(element) {
		const bounds = this.bound(element);
		return {
			x: bounds.x + bounds.width / 2,
			y: bounds.y + bounds.height / 2,
		};
	}

	static bound(element): { x: number; y: number; width: number; height: number } {
		return {
			x: element.x,
			y: element.y,
			width: element.width,
			height: element.height,
		};
	}

	static move(element, position, last_position) {
		element.x += position.x - last_position.x;
		element.y += position.y - last_position.y;
	}

	static rotatePoint(position, center, rotation) {
		const sin = Math.sin(rotation);
		const cos = Math.cos(rotation);
		const x = position.x - center.x;
		const y = position.y - center.y;

		return {
			x: x * cos - y * sin + center.x,
			y: y * cos + x * sin + center.y,
		};
	}

	static collideResize(element, position, box_size): boolean {
		const bounds = this.bound(element);

		position = this.rotatePoint(position, this.center(element), -element.rotation);

		return !!this.boxes(element.id, bounds, box_size).find((box) => this.collideBox(box, position));
	}

	static collideRotate(element, position, box_size): boolean {
		const bounds = this.bound(element);
		bounds.x -= box_size;
		bounds.y -= box_size;
		bounds.width += box_size * 2;
		bounds.height += box_size * 2;

		position = this.rotatePoint(position, this.center(element), -element.rotation);

		return !!this.boxes(element.id, bounds, box_size * 2).find((box) => this.collideBox(box, position));
	}

	static collideHighlight(element, position) {
		position = this.rotatePoint(position, this.center(element), -element.rotation);
		return this.collideBox(this.bound(element), position);
	}

	static rotate(element, theta) {
		element.rotation += theta;
	}

	static collideBox(box, position) {
		return box.x < position.x && position.x < box.x + box.width && box.y < position.y && position.y < box.y + box.width;
	}

	static drawSquare(square, context: CanvasRenderingContext2D, color, line_width) {
		context.fillStyle = 'white';

		context.beginPath();
		context.rect(square.x, square.y, square.width, square.height);
		context.fill();

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.stroke();
	}

	static boxes(id, bounds, box_size) {
		return [
			{
				id: id,
				x: bounds.x - box_size,
				y: bounds.y - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
			{
				id: id,
				x: bounds.x + bounds.width - box_size,
				y: bounds.y - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
			{
				id: id,
				x: bounds.x - box_size,
				y: bounds.y + bounds.height - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
			{
				id: id,
				x: bounds.x + bounds.width - box_size,
				y: bounds.y + bounds.height - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
		];
	}
}
