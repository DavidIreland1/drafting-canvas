import Element from './element';

export default class Rectangle extends Element {
	static create(id, position) {
		return Object.assign(super.create(id, position), {
			x: position.x,
			y: position.y,
			label: 'Rectangle',
			type: 'rectangle',
			rotation: 0,
			width: 0,
			height: 0,
		});
	}

	static draw(rectangle, context: CanvasRenderingContext2D, cursor) {
		const center = this.center(rectangle);

		context.fillStyle = rectangle.color;
		context.translate(center.x, center.y);
		context.rotate(rectangle.rotation);
		context.beginPath();
		context.rect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);

		this.fill(rectangle, context);
		this.stroke(rectangle, context);

		context.rotate(-rectangle.rotation);
		context.translate(-center.x, -center.y);
		return context.isPointInPath(cursor.x, cursor.y);
	}

	static outline(rectangle, context, color, line_width): void {
		const center = this.center(rectangle);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.translate(center.x, center.y);
		context.rotate(rectangle.rotation);
		context.beginPath();
		context.rect(-rectangle.width / 2, -rectangle.height / 2, rectangle.width, rectangle.height);
		context.stroke();
		context.rotate(-rectangle.rotation);
		context.translate(-center.x, -center.y);
	}

	static bound(rectangle): { x: number; y: number; width: number; height: number } {
		return {
			x: rectangle.x,
			y: rectangle.y,
			width: rectangle.width,
			height: rectangle.height,
		};
	}

	static resize(rectangle, position, last_position): void {
		const center = this.center(rectangle);

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -rectangle.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -rectangle.rotation);

		// rectangle.x = Math.round(new_oposite.x);
		rectangle.x = new_oposite.x;
		// rectangle.y = Math.round(new_oposite.y);
		rectangle.y = new_oposite.y;
		rectangle.width = new_poistion.x - new_oposite.x;
		rectangle.height = new_poistion.y - new_oposite.y;
	}

	static stretch(rectangle, position, last_position): void {
		const center = this.center(rectangle);

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -rectangle.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -rectangle.rotation);

		// rectangle.x = new_oposite.x;
		rectangle.y = new_oposite.y;
		// rectangle.width = new_poistion.x - new_oposite.x;
		rectangle.height = new_poistion.y - new_oposite.y;
	}
}
