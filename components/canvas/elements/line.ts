import Element from './element';

export default class Line extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Line',
			type: 'line',
			fill: [],
			stroke: [{ id: id + '564', type: 'Center', width: 2, color: [0.2, 0.2, 0.2, 1], format: 'hex4', visible: true }],
			points: [
				{ x: position.x, y: position.y, id: id + '0', controls: [] },
				{ x: position.x, y: position.y, i: id + '1', controls: [] },
			],
		});
	}

	static path(line) {
		const path = new Path2D();
		line.points.forEach((point) => path.lineTo(point.x, point.y));
		return path;
	}

	static draw(line, context: CanvasRenderingContext2D, cursor, view) {
		const path = this.path(line);
		context.lineWidth = this.stroke(line, context, path);
		return context.isPointInStroke(path, cursor.x, cursor.y) ? line : undefined;
	}

	// static highlight(line, context, cursor, highlight, line_width, box_size) {
	// 	this.outline(line, context, highlight, line_width);
	// 	let action = undefined;
	// 	if (this.drawStretch(line, context, cursor, highlight, line_width)) action = 'stretch';
	// 	if (this.drawRotate(line, context, cursor, box_size)) action = 'rotate';
	// 	if (this.drawResize(line, context, cursor, highlight, line_width, box_size)) action = 'resize';
	// 	return action ? { action: action, element: line } : undefined;
	// }

	// static drawStretch(element, context, cursor, color, line) {
	// 	return false;
	// }

	// static drawRotate(line, context, cursor, box_size) {
	// 	// context.beginPath();
	// 	// const angle = Math.atan2(line.points[0].y - line.points[1].y, line.points[0].x - line.points[1].x);
	// 	// this.boxes(line, box_size * 2).forEach((box) => {
	// 	// 	context.translate(box.x, box.y);
	// 	// 	context.rotate(angle);
	// 	// 	context.rect(-box.width, -box.width, box.width * 2, box.height * 2);
	// 	// 	context.rotate(-angle);
	// 	// 	context.translate(-box.x, -box.y);
	// 	// });
	// 	// context.fill();
	// 	// context.stroke();
	// 	// return context.isPointInPath(cursor.x, cursor.y);
	// 	return false;
	// }

	// static drawResize(line, context, cursor, highlight, line_width, box_size) {
	// 	context.fillStyle = 'white';
	// 	context.strokeStyle = highlight;
	// 	context.lineWidth = line_width;
	// 	context.beginPath();
	// 	const angle = Math.atan2(line.points[0].y - line.points[1].y, line.points[0].x - line.points[1].x);
	// 	this.boxes(line, box_size).forEach((box) => {
	// 		context.translate(box.x, box.y);
	// 		context.rotate(angle);
	// 		context.rect(-box.width, -box.width, box.width * 2, box.height * 2);
	// 		context.rotate(-angle);
	// 		context.translate(-box.x, -box.y);
	// 	});
	// 	context.fill();
	// 	context.stroke();
	// 	return context.isPointInPath(cursor.x, cursor.y);
	// }

	// static center(line): { x: number; y: number } {
	// 	return {
	// 		x: line.points[0].x + (line.points[0].x + line.points[1].x) / 2,
	// 		y: line.points[0].y + (line.points[0].y + line.points[1].y) / 2,
	// 	};
	// }

	// static bound(line): { x: number; y: number; width: number; height: number } {
	// 	const x = Math.min(line.points[0].x, line.points[1].x);
	// 	const y = Math.min(line.points[0].y, line.points[1].y);
	// 	return {
	// 		x: x,
	// 		y: y,
	// 		width: Math.max(line.points[0].x, line.points[1].x) - x,
	// 		height: Math.max(line.points[0].y, line.points[1].y) - y,
	// 	};
	// }

	// static move(element, position, last_position) {
	// 	const delta_x = position.x - last_position.x;
	// 	const delta_y = position.y - last_position.y;
	// 	element.x1 += delta_x;
	// 	element.y1 += delta_y;
	// 	element.x2 += delta_x;
	// 	element.y2 += delta_y;
	// }

	static resize(line, position, last_position): void {
		if (closestPoint(line, last_position)) {
			line.points[0].x = Math.round(position.x);
			line.points[0].y = Math.round(position.y);
		} else {
			line.points[1].x = Math.round(position.x);
			line.points[1].y = Math.round(position.y);
		}
	}

	// static points(line) {
	// 	return [
	// 		{
	// 			x: line.points[0].x,
	// 			y: line.points[0].y,
	// 			controls: [],
	// 		},
	// 		{
	// 			x: line.points[1].x,
	// 			y: line.points[1].y,
	// 			controls: [],
	// 		},
	// 	];
	// }

	// static boxes(line, box_size) {
	// 	return line.points.map((point) => ({
	// 		id: line.id,
	// 		x: point.x,
	// 		y: point.y,
	// 		width: box_size,
	// 		height: box_size,
	// 	}));
	// }
}
function closestPoint(line, position) {
	return (line.points[0].x - position.x) ** 2 + (line.points[0].y - position.y) ** 2 < (line.points[1].x - position.x) ** 2 + (line.points[1].y - position.y) ** 2;
}
