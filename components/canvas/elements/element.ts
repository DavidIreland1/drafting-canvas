// import Defaults from './../../defaults';
// const { line_width, box_size, highlight_color } = Defaults;

export default class Element {
	static draw(element, context): void {
		return;
	}

	static resize(element, position, last_position): void {
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
		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
		context.stroke();

		this.boxes(bounds, color, line_width, box_size).forEach((square) => {
			this.drawSquare(square, context);
		});
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

	static collideEdit(element, position, view): boolean {
		const bounds = this.bound(element);
		const size = 8 / view.scale;
		const line = 1 / view.scale;

		return !!this.boxes(bounds, '', line, size).find((box) => this.collideBox(box, position));
	}

	static collideBox(box, position) {
		return box.x < position.x && position.x < box.x + box.width && box.y < position.y && position.y < box.y + box.width;
	}

	static drawSquare(square, context) {
		context.fillStyle = square.color;
		context.beginPath();
		context.rect(square.x, square.y, square.width, square.height);
		context.fill();

		if (square.border) {
			context.strokeStyle = square.border.color;
			context.lineWisth = square.border.width;
			context.stroke();
		}
	}

	static boxes(bounds, color, line_width, box_size) {
		return [
			{
				x: bounds.x - box_size,
				y: bounds.y - box_size,
				width: box_size * 2,
				height: box_size * 2,
				color: 'white',
				border: {
					color: color,
					width: line_width,
				},
			},
			{
				x: bounds.x + bounds.width - box_size,
				y: bounds.y - box_size,
				width: box_size * 2,
				height: box_size * 2,
				color: 'white',
				border: {
					color: color,
					width: line_width,
				},
			},
			{
				x: bounds.x - box_size,
				y: bounds.y + bounds.height - box_size,
				width: box_size * 2,
				height: box_size * 2,
				color: 'white',
				border: {
					color: color,
					width: line_width,
				},
			},
			{
				x: bounds.x + bounds.width - box_size,
				y: bounds.y + bounds.height - box_size,
				width: box_size * 2,
				height: box_size * 2,
				color: 'white',
				border: {
					color: color,
					width: line_width,
				},
			},
		];
	}
}
