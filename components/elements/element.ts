// import Defaults from './../../defaults';
// const { line, box_size, highlight_color } = Defaults;

import Colors from './../properties/colors';
export default class Element {
	static create(id, position): Object {
		return {
			id: id,
			selected: true,
			hover: false,
			fill: [{ id: id + '2123', color: [1, 0, 0, 1], visible: true }],
			stroke: [],
			visible: true,
			locked: false,
		};
	}

	static path(element) {
		return new Path2D();
	}

	static fill(element, context, path) {
		element.fill.forEach((fill) => {
			context.fillStyle = Colors.rgbaToString(fill.color);
			context.fill(path);
		});
	}

	static stroke(element, context, path) {
		element.stroke.forEach((stroke) => {
			context.lineWidth = stroke.width;
			context.strokeStyle = Colors.rgbaToString(stroke.color);
			context.stroke(path);
		});
	}

	static draw(element, context: CanvasRenderingContext2D, cursor): boolean {
		const path = this.path(element);

		this.fill(element, context, path);
		const fill = element.fill.length && context.isPointInPath(path, cursor.x, cursor.y);

		this.stroke(element, context, path);
		const stroke = element.stroke.length && context.isPointInStroke(path, cursor.x, cursor.y);

		return fill || stroke;
	}

	static resize(element, position, last_position): void {
		return;
	}

	static stretch(element, position, last_position): void {
		return;
	}

	static outline(element, context: CanvasRenderingContext2D, color: string, line: number): void {
		return;
	}

	static onScreen(element, screen) {
		const bounds = this.positiveBound(element);
		return !(bounds.x > screen.x2 || bounds.y > screen.y2 || bounds.x + bounds.width < screen.x1 || bounds.y + bounds.height < screen.y1);
	}

	static highlight(element, context, cursor, highlight, line, box) {
		this.outline(element, context, highlight, line);
		let action = undefined;
		if (this.drawBound(element, context, cursor, highlight, line)) action = 'stretch';
		if (this.drawRotate(element, context, cursor, box)) action = 'rotate';
		if (this.drawResize(element, context, cursor, highlight, line, box)) action = 'resize';
		return action ? { action: action, element: element } : undefined;
	}

	static insideBound(element, context: CanvasRenderingContext2D, cursor): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.translate(center.x, center.y);
		context.rotate(element.rotation);
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		context.rotate(-element.rotation);
		context.translate(-center.x, -center.y);

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawBound(element, context: CanvasRenderingContext2D, cursor, color: string, line: number): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.translate(center.x, center.y);
		context.rotate(element.rotation);
		context.strokeStyle = color;
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		context.lineWidth = line * 2;
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

		if (Math.abs(bounds.width) + Math.abs(bounds.height) > box_size * 4) {
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

		bounds.x = -bounds.width / 2 - Math.sign(bounds.width) * box_size;
		bounds.y = -bounds.height / 2 - Math.sign(bounds.height) * box_size;
		bounds.width += Math.sign(bounds.width) * box_size * 2;
		bounds.height += Math.sign(bounds.height) * box_size * 2;

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

	static getFill(element) {
		return element.fill;
	}

	static setFill(element, props) {
		element.fill.forEach((fill) => {
			if (props.color_id === fill.id) fill.color = props.color;
		});
	}

	static getStroke(element) {
		return element.stroke;
	}

	static setStroke(element, props) {
		element.stroke.forEach((stroke) => {
			if (props.color_id === stroke.id) stroke.color = props.color;
		});
	}

	static positiveBound(element): { x: number; y: number; width: number; height: number } {
		const bounds = this.bound(element);
		return {
			x: Math.min(bounds.x, bounds.x + bounds.width),
			y: Math.min(bounds.y, bounds.y + bounds.height),
			width: Math.abs(bounds.width),
			height: Math.abs(bounds.height),
		};
	}

	static points(element) {
		return [this.center(element)];
	}

	static move(element, position, last_position) {
		element.x = element.x + position.x - last_position.x;
		element.y = element.y + position.y - last_position.y;
	}

	static rotatePoint(position, center, rotation) {
		return {
			x: (position.x - center.x) * Math.cos(rotation) - (position.y - center.y) * Math.sin(rotation) + center.x,
			y: (position.x - center.x) * Math.sin(rotation) + (position.y - center.y) * Math.cos(rotation) + center.y,
		};
	}

	static rotate(element, position, last_position) {
		const center = this.center(element);
		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);
		element.rotation += rotation;
		return rotation;
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
