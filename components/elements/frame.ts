import Group from './group';
import Elements from './elements';

export default class Frame extends Group {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Frame',
			type: 'frame',
			rotation: 0,
			width: 0,
			height: 0,
			fill: [{ id: id + '2123', color: [1, 1, 1, 1] }],
		});
	}

	static points(frame) {
		return [
			{
				x: -frame.width / 2,
				y: -frame.height / 2,
				radius: frame.radius,
			},
			{
				x: frame.width / 2,
				y: -frame.height / 2,
				radius: frame.radius,
			},
			{
				x: frame.width / 2,
				y: frame.height / 2,
				radius: frame.radius,
			},
			{
				x: -frame.width / 2,
				y: frame.height / 2,
				radius: frame.radius,
			},
		];
	}

	static path(frame) {
		const path = new Path2D();
		this.points(frame).forEach((point) => path.lineTo(point.x, point.y));
		path.closePath();
		return path;
	}

	static draw(frame, context: CanvasRenderingContext2D, cursor, draw) {
		const center = this.center(frame);

		context.fillStyle = frame.color;
		context.translate(center.x, center.y);
		context.rotate(frame.rotation);
		context.beginPath();

		const path = this.path(frame);

		this.fill(frame, context, path);
		this.stroke(frame, context, path);

		const hover = context.isPointInPath(path, cursor.x, cursor.y);

		context.rotate(-frame.rotation);
		context.translate(-center.x, -center.y);

		const hover_child = frame.elements
			.filter((element) => element.visible)
			.reverse()
			.filter((element) => Elements[element.type].draw(element, context, cursor, draw))
			.filter((element) => !element.locked);

		if (hover_child.length > 0) return hover_child.length > 0;
		return hover;
	}

	static outline(frame, context, color, line_width): void {
		const center = this.center(frame);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.translate(center.x, center.y);
		context.rotate(frame.rotation);
		const path = this.path(frame);
		context.stroke(path);
		context.rotate(-frame.rotation);
		context.translate(-center.x, -center.y);
	}

	static move(element, position, last_position) {
		element.x = element.x + position.x - last_position.x;
		element.y = element.y + position.y - last_position.y;
	}

	static bound(frame): { x: number; y: number; width: number; height: number } {
		return {
			x: frame.x,
			y: frame.y,
			width: frame.width,
			height: frame.height,
		};
	}

	static resize(frame, position, last_position): void {
		const center = this.center(frame);

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -frame.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -frame.rotation);

		// frame.x = new_oposite.x;
		frame.x = new_oposite.x;
		// frame.y = new_oposite.y)
		frame.y = new_oposite.y;
		frame.width = new_poistion.x - new_oposite.x;
		frame.height = new_poistion.y - new_oposite.y;
	}

	static stretch(frame, position, last_position): void {
		const center = this.center(frame);

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -frame.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -frame.rotation);

		// frame.x = new_oposite.x;
		frame.y = new_oposite.y;
		// frame.width = new_poistion.x - new_oposite.x;
		frame.height = new_poistion.y - new_oposite.y;
	}
}
