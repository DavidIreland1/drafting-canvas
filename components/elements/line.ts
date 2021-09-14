import Element from './element';

export default class Line extends Element {
	static create(id, position) {
		return Object.assign(super.create(id, position), {
			x1: position.x,
			y1: position.y,
			x2: position.x,
			y2: position.y,
			label: 'Line',
			type: 'line',
			fill: [],
			stroke: [{ id: id + '564', width: 1, color: [0.2, 0.2, 0.2, 1], visible: true }],
		});
	}

	static draw(line, context: CanvasRenderingContext2D, cursor, view) {
		context.beginPath();
		// context.moveTo(line.x1, line.y1);
		// context.lineTo(line.x2, line.y2);

		const path = new Path2D();
		path.moveTo(line.x1, line.y1);
		path.lineTo(line.x2, line.y2);

		this.fill(line, context, path);
		this.stroke(line, context, path);

		// context.lineWidth = line.stroke.reduce((max, stroke) => Math.max(max, stroke.width), 0);

		return context.isPointInStroke(path, cursor.x, cursor.y);
	}

	static outline(line, context: CanvasRenderingContext2D, color, line_width) {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.moveTo(line.x1, line.y1);
		context.lineTo(line.x2, line.y2);
		context.stroke();
	}

	static highlight(line, context, cursor, highlight, line_width, box_size) {
		this.outline(line, context, highlight, line_width);
		let action = undefined;
		if (this.drawBound(line, context, cursor, highlight, line_width)) action = 'stretch';
		if (this.drawRotate(line, context, cursor, box_size)) action = 'rotate';
		if (this.drawResize(line, context, cursor, highlight, line_width, box_size)) action = 'resize';
		return action ? { action: action, element: line } : undefined;
	}

	static drawBound(element, context, cursor, color, line) {
		return false;
	}

	static drawRotate(line, context, cursor, box_size) {
		// context.fillStyle = 'grey';
		// context.beginPath();
		// const angle = rotation(line);
		// this.boxes(line, box_size * 2).forEach((square) => {
		// 	context.translate(square.x, square.y);
		// 	context.rotate(angle);
		// 	context.rect(-square.width, -square.width, square.width * 2, square.height * 2);
		// 	context.rotate(-angle);
		// 	context.translate(-square.x, -square.y);
		// });
		// context.fill();
		// context.stroke();
		// return context.isPointInPath(cursor.x, cursor.y);
		return false;
	}

	static drawResize(line, context, cursor, highlight, line_width, box_size) {
		context.fillStyle = 'white';
		context.strokeStyle = highlight;
		context.lineWidth = line_width;
		context.beginPath();
		const angle = rotation(line);
		this.boxes(line, box_size).forEach((square) => {
			context.translate(square.x, square.y);
			context.rotate(angle);
			context.rect(-square.width, -square.width, square.width * 2, square.height * 2);
			context.rotate(-angle);
			context.translate(-square.x, -square.y);
		});
		context.fill();
		context.stroke();
		return context.isPointInPath(cursor.x, cursor.y);
	}

	static center(line): { x: number; y: number } {
		return {
			x: line.x1 + (line.x1 + line.x2) / 2,
			y: line.y1 + (line.y1 + line.y2) / 2,
		};
	}

	static bound(line): { x: number; y: number; width: number; height: number } {
		const x = Math.min(line.x1, line.x2);
		const y = Math.min(line.y1, line.y2);
		return {
			x: x,
			y: y,
			width: Math.max(line.x1, line.x2) - x,
			height: Math.max(line.y1, line.y2) - y,
		};
	}

	static move(element, position, last_position) {
		const delta_x = position.x - last_position.x;
		const delta_y = position.y - last_position.y;
		element.x1 += delta_x;
		element.y1 += delta_y;
		element.x2 += delta_x;
		element.y2 += delta_y;
	}

	static resize(line, position, last_position): void {
		if (closesetPoint(line, last_position)) {
			line.x1 = Math.round(position.x);
			line.y1 = Math.round(position.y);
		} else {
			line.x2 = Math.round(position.x);
			line.y2 = Math.round(position.y);
		}
	}

	static rotate(line, position, last_position) {
		// const center = this.center(line);

		// const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

		// console.log('Broken');
		// this.resize(line, position, last_position);

		// const oposite = {
		// 	x: center.x - (last_position.x - center.x),
		// 	y: center.y - (position.y - center.y),
		// };

		// // const new_center = {
		// // 	x: (oposite.x + position.x) / 2,
		// // 	y: (oposite.y + position.y) / 2,
		// // };

		// const new_oposite = this.rotatePoint({ x: line.x1, y: line.y1 }, center, -rotation);
		// const new_poistion = this.rotatePoint({ x: line.x2, y: line.y2 }, center, -rotation);

		// line.x1 = new_oposite.x;
		// line.y1 = new_oposite.y;
		// line.x2 = new_poistion.x;
		// line.y2 = new_poistion.y;

		return 0;
	}

	static rotatePoint(position, center, rotation) {
		return {
			x: (position.x - center.x) * Math.cos(rotation) - (position.y - center.y) * Math.sin(rotation) + center.x,
			y: (position.x - center.x) * Math.sin(rotation) + (position.y - center.y) * Math.cos(rotation) + center.y,
		};
	}

	static stretch(line, position, last_position): void {}

	static points(line) {
		return [
			{
				x: line.x1,
				y: line.y1,
			},
			{
				x: line.x2,
				y: line.y2,
			},
		];
	}

	static boxes(line, box_size) {
		return [
			{
				id: line.id,
				x: line.x1,
				y: line.y1,
				width: box_size,
				height: box_size,
			},
			{
				id: line.id,
				x: line.x2,
				y: line.y2,
				width: box_size,
				height: box_size,
			},
		];
	}
}

function closesetPoint(line, position) {
	return (line.x1 - position.x) ** 2 + (line.y1 - position.y) ** 2 < (line.x2 - position.x) ** 2 + (line.y2 - position.y) ** 2;
}

function rotation(line) {
	return Math.atan2(line.y1 - line.y2, line.x1 - line.x2);
}
