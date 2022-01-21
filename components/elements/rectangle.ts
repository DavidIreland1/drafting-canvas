import Element from './element';

export default class Rectangle extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Rectangle',
			type: 'rectangle',
			rotation: 0,
			width: 0,
			height: 0,
			radius: 0,
		});
	}

	static points(rectangle) {
		const center = this.center(rectangle);
		return this._points(rectangle)
			.map((point) => ({
				x: point.x + rectangle.x + rectangle.width / 2,
				y: point.y + rectangle.y + rectangle.height / 2,
			}))
			.map((point) => this.rotatePoint(point, center, rectangle.rotation))
			.concat(center);
	}

	static _points(rectangle) {
		return [
			{
				x: -rectangle.width / 2,
				y: -rectangle.height / 2,
				radius: rectangle.radius,
			},
			{
				x: rectangle.width / 2,
				y: -rectangle.height / 2,
				radius: rectangle.radius,
			},
			{
				x: rectangle.width / 2,
				y: rectangle.height / 2,
				radius: rectangle.radius,
			},
			{
				x: -rectangle.width / 2,
				y: rectangle.height / 2,
				radius: rectangle.radius,
			},
		];
	}

	static path(rectangle) {
		const points = this._points(rectangle);

		const delta_x = [0, -1, 0, 1];
		const delta_y = [1, 0, -1, 0];
		const cente_x = [1, -1, -1, 1];
		const cente_y = [1, 1, -1, -1];

		let angle = Math.PI;
		const delta_angle = Math.PI / 2;

		const path = new Path2D();
		if (rectangle.radius.length || rectangle.radius > 0) {
			const radius = Math.min(Math.min(Math.abs(rectangle.width), Math.abs(rectangle.height)) / 2, rectangle.radius);

			points.forEach((point, i) => {
				path.lineTo(point.x + radius * delta_x[i], point.y + radius * delta_y[i]);
				path.arc(point.x + radius * cente_x[i], point.y + radius * cente_y[i], radius, angle, angle + delta_angle);
				angle += delta_angle;
			});
		} else {
			points.forEach((point) => path.lineTo(point.x, point.y));
		}
		path.closePath();

		return path;
	}

	static draw(rectangle, context: CanvasRenderingContext2D, cursor, view) {
		const center = this.center(rectangle);
		const path = this.path(rectangle);

		context.fillStyle = rectangle.color;

		context.save();
		context.translate(center.x, center.y);
		this.effect(rectangle, context, path, true, view);

		context.rotate(rectangle.rotation);
		this.fill(rectangle, context, path);
		this.effect(rectangle, context, path, false, view);
		this.stroke(rectangle, context, path);

		const hover = context.isPointInPath(path, cursor.x, cursor.y);

		context.restore();

		return hover;
	}

	static outline(rectangle, context, color, line_width): void {
		const center = this.center(rectangle);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.save();
		context.translate(center.x, center.y);
		context.rotate(rectangle.rotation);
		const path = this.path(rectangle);
		context.stroke(path);
		context.restore();
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

		// rectangle.x = new_oposite.x;
		rectangle.x = new_oposite.x;
		// rectangle.y = new_oposite.y)
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
