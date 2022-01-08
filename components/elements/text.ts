import Element from './element';

export default class Text extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Text',
			type: 'text',
			text: 'Hello World',
			rotation: 0,
			width: 0,
			height: 0,
			fill: [{ id: id + '123321', type: 'Text', color: [1, 1, 0, 1], visible: true }],
		});
	}

	static points(text) {
		const center = this.center(text);
		return this._points(text)
			.map((point) => ({
				x: point.x + text.x + text.width / 2,
				y: point.y + text.y + text.height / 2,
			}))
			.map((point) => this.rotatePoint(point, center, text.rotation))
			.concat(center);
	}

	static _points(text) {
		return [
			{
				x: -text.width / 2,
				y: -text.height / 2,
			},
			{
				x: text.width / 2,
				y: -text.height / 2,
			},
			{
				x: text.width / 2,
				y: text.height / 2,
			},
			{
				x: -text.width / 2,
				y: text.height / 2,
			},
		];
	}

	static path(text) {
		const points = this._points(text);
		const path = new Path2D();
		points.forEach((point) => path.lineTo(point.x, point.y));
		path.closePath();
		return path;
	}

	static draw(text, context: CanvasRenderingContext2D, cursor, view) {
		const center = this.center(text);
		const path = this.path(text);

		context.fillStyle = text.color;

		context.save();
		context.translate(center.x, center.y);
		this.effect(text, context, path, true, view);
		context.rotate(text.rotation);
		this.fill(text, context, path);
		this.effect(text, context, path, false, view);
		this.stroke(text, context, path);

		const hover = context.isPointInPath(path, cursor.x, cursor.y);

		context.restore();

		return hover;
	}

	static outline(text, context, color, line_width): void {
		const center = this.center(text);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.save();
		context.translate(center.x, center.y);
		context.rotate(text.rotation);
		const path = this.path(text);
		context.stroke(path);
		context.restore();
	}

	static bound(text): { x: number; y: number; width: number; height: number } {
		return {
			x: text.x,
			y: text.y,
			width: text.width,
			height: text.height,
		};
	}

	static resize(text, position, last_position): void {
		const center = this.center(text);

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -text.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -text.rotation);

		// text.x = new_oposite.x;
		text.x = new_oposite.x;
		// text.y = new_oposite.y)
		text.y = new_oposite.y;
		text.width = new_poistion.x - new_oposite.x;
		text.height = new_poistion.y - new_oposite.y;
	}

	static stretch(text, position, last_position): void {
		const center = this.center(text);

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -text.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -text.rotation);

		// text.x = new_oposite.x;
		text.y = new_oposite.y;
		// text.width = new_poistion.x - new_oposite.x;
		text.height = new_poistion.y - new_oposite.y;
	}
}
