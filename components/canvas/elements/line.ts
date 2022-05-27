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

	static resize(line, position, last_position): void {
		if (closestPoint(line, last_position)) {
			line.points[0].x = Math.round(position.x);
			line.points[0].y = Math.round(position.y);
		} else {
			line.points[1].x = Math.round(position.x);
			line.points[1].y = Math.round(position.y);
		}
	}
}
function closestPoint(line, position) {
	return (line.points[0].x - position.x) ** 2 + (line.points[0].y - position.y) ** 2 < (line.points[1].x - position.x) ** 2 + (line.points[1].y - position.y) ** 2;
}
