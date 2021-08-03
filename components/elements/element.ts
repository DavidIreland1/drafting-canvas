// import Defaults from './../../defaults';
// const { line, box_size, highlight_color } = Defaults;

export default class Element {
	static draw(element, context, cursor): boolean {
		return;
	}

	static resize(element, position, last_position, direction_x, direction_y): void {
		return;
	}

	static collide(element, position): boolean {
		return false;
	}

	static outline(element, context: CanvasRenderingContext2D, color: string, line: number): void {
		return;
	}

	static highlight(element, context, cursor, highlight, line, box) {
		let action = undefined;
		if (this.drawBound(element, context, cursor, highlight, line)) action = 'stretch';
		if (this.drawRotate(element, context, cursor, box)) action = 'rotate';
		if (this.drawResize(element, context, cursor, highlight, line, box)) action = 'resize';
		return action ? { action: action, element: element } : undefined;
	}

	static drawBound(element, context: CanvasRenderingContext2D, cursor, color: string, line: number): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.translate(center.x, center.y);
		context.rotate(element.rotation);
		context.strokeStyle = color;
		context.lineWidth = line * 10;
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		const hov = context.isPointInStroke(cursor.x, cursor.y);
		context.lineWidth = line;
		context.stroke();
		context.rotate(-element.rotation);
		context.translate(-center.x, -center.y);

		return hov;
	}

	static drawResize(element, context: CanvasRenderingContext2D, cursor, color: string, line: number, box_size: number): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.translate(center.x, center.y);
		context.rotate(element.rotation);

		if (bounds.width + bounds.height > box_size * 4) {
			bounds.x = -bounds.width / 2;
			bounds.y = -bounds.height / 2;
			context.fillStyle = 'white';
			context.strokeStyle = color;
			context.lineWidth = line;

			context.beginPath();
			this.boxes(element.id, bounds, box_size).forEach((square) => context.rect(square.x, square.y, square.width, square.height));
			context.fill();
			context.stroke();
		}

		context.rotate(-element.rotation);
		context.translate(-center.x, -center.y);

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawRotate(element, context: CanvasRenderingContext2D, cursor, box_size: number): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.translate(center.x, center.y);
		context.rotate(element.rotation);

		bounds.x = -bounds.width / 2 - box_size;
		bounds.y = -bounds.height / 2 - box_size;
		bounds.width += box_size * 2;
		bounds.height += box_size * 2;

		context.beginPath();
		this.boxes(element.id, bounds, box_size * 2).forEach((square) => context.rect(square.x, square.y, square.width, square.height));

		context.rotate(-element.rotation);
		context.translate(-center.x, -center.y);

		return context.isPointInPath(cursor.x, cursor.y);
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
