import { rotatePoint } from '../../utils/utils';
import Element from './element';

export default class Rectangle extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Rectangle',
			type: 'rectangle',
			rotation: 0,
			width: 1,
			height: 1,
			radius: 0,
			points: this.makePoints({ ...position, width: 1, height: 1, radius: 0 }),
		});
	}

	static points(rectangle) {
		const center = this.center(rectangle);
		return this.makePoints(rectangle)
			.map((point) => ({
				x: point.x + rectangle.x + rectangle.width / 2,
				y: point.y + rectangle.y + rectangle.height / 2,
			}))
			.map((point) => rotatePoint(point, center, rectangle.rotation))
			.concat(center);
	}

	static makePoints(rectangle) {
		return [
			{
				id: rectangle.id,
				x: -rectangle.width / 2,
				y: -rectangle.height / 2,
				radius: rectangle.radius,
			},
			{
				id: rectangle.id,
				x: rectangle.width / 2,
				y: -rectangle.height / 2,
				radius: rectangle.radius,
			},
			{
				id: rectangle.id,
				x: rectangle.width / 2,
				y: rectangle.height / 2,
				radius: rectangle.radius,
			},
			{
				id: rectangle.id,
				x: -rectangle.width / 2,
				y: rectangle.height / 2,
				radius: rectangle.radius,
			},
		].map((point, i) => ({ ...point, i }));
	}

	static path(rectangle) {
		const path = new Path2D();
		rectangle.points.forEach((point) => path.lineTo(point.x, point.y));
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

		const opposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		const new_position = rotatePoint(position, new_center, -rectangle.rotation);

		rectangle.x = new_opposite.x;
		rectangle.y = new_opposite.y;
		rectangle.width = new_position.x - new_opposite.x;
		rectangle.height = new_position.y - new_opposite.y;

		rectangle.points.forEach((point) => {
			// Move each point
			// const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		});
		rectangle.points = this.makePoints(rectangle);
	}

	static stretch(rectangle, position, last_position): void {
		const center = this.center(rectangle);

		const opposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		const new_position = rotatePoint(position, new_center, -rectangle.rotation);

		// rectangle.x = new_opposite.x;
		rectangle.y = new_opposite.y;
		// rectangle.width = new_position.x - new_opposite.x;
		rectangle.height = new_position.y - new_opposite.y;

		rectangle.points = this.makePoints(rectangle);
	}
}
