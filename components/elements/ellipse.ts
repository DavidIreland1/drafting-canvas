import Element from './element';

export default class Ellipse extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Ellipse',
			type: 'ellipse',
			x: position.x,
			y: position.y,
			rotation: 0,
			// start_angle: 0,
			// end_angle: 6.283185307179586,
			points: this.makePoints(position.x, position.y, 1, 1),
		});
	}

	static makePoints(x, y, width, height) {
		return [
			{
				x: x + width,
				y: y + height / 2,
				to: {
					x: x + width,
					y: y + height / 2,
				},
				from: {
					x: x + width,
					y: y + height / 2,
				},
			},
			{
				x: x + width / 2,
				y: y + height,
				to: {
					x: x + width / 2,
					y: y + height,
				},
				from: {
					x: x + width / 2,
					y: y + height,
				},
			},
			{
				x: x,
				y: y + height / 2,
				to: {
					x: x,
					y: y + height / 2,
				},
				from: {
					x: x,
					y: y + height / 2,
				},
			},
			{
				x: x + width / 2,
				y: y,
				to: {
					x: x + width / 2,
					y: y,
				},
				from: {
					x: x + width / 2,
					y: y,
				},
			},
		].map((point, i) => ({ ...point, i }));
	}

	// static points(ellipse) {
	// 	const center = this.center(ellipse);
	// 	return [
	// 		{
	// 			x: ellipse.x,
	// 			y: ellipse.y,
	// 		},
	// 		{
	// 			x: ellipse.x - ellipse.radius_x,
	// 			y: ellipse.y - ellipse.radius_y,
	// 		},
	// 		{
	// 			x: ellipse.x - ellipse.radius_x,
	// 			y: ellipse.y + ellipse.radius_y,
	// 		},
	// 		{
	// 			x: ellipse.x + ellipse.radius_x,
	// 			y: ellipse.y - ellipse.radius_y,
	// 		},
	// 		{
	// 			x: ellipse.x + ellipse.radius_x,
	// 			y: ellipse.y + ellipse.radius_y,
	// 		},
	// 	].map((point) => rotatePoint(point, center, ellipse.rotation));
	// }

	static path(line) {
		const path = new Path2D();

		const num_points = line.points.length;

		path.moveTo(line.points[0].x, line.points[0].y);
		line.points.forEach((point, i, points) => {
			const next = points[(i + 1) % num_points];
			console.log(point.from.x, point.from.y, next.to.x, next.to.y, next.x, next.y);
			path.bezierCurveTo(point.from.x, point.from.y, next.to.x, next.to.y, next.x, next.y);
		});

		path.closePath();

		// let last_curve = { x2: undefined, y2: undefined };

		// line.curves.forEach((curve) => {
		// 	if (!curve.x2) return;
		// 	if (last_curve.x2 !== curve.x1 || last_curve.y2 !== curve.y1) path.moveTo(curve.x1, curve.y1);
		// 	path.bezierCurveTo(curve.x1cp, curve.y1cp, curve.x2cp, curve.y2cp, curve.x2, curve.y2);
		// 	last_curve = curve;
		// });

		return path;
	}

	// static path(line) {
	// 	const path = new Path2D();
	// 	line.points.forEach((point) => path.lineTo(point.x, point.y));
	// 	return path;
	// }

	// static draw(ellipse, context: CanvasRenderingContext2D, cursor, view) {
	// 	context.beginPath();
	// 	const path = this.path(ellipse);

	// 	this.effect(ellipse, context, path, true, view);
	// 	this.fill(ellipse, context, path);
	// 	this.effect(ellipse, context, path, false, view);
	// 	this.stroke(ellipse, context, path);

	// 	// context.shadowColor = 'transparent';
	// 	return context.isPointInPath(path, cursor.x, cursor.y);
	// }

	// static bound(ellipse): { x: number; y: number; width: number; height: number } {
	// 	return {
	// 		x: ellipse.x - ellipse.radius_x,
	// 		y: ellipse.y - ellipse.radius_y,
	// 		width: ellipse.radius_x * 2,
	// 		height: ellipse.radius_y * 2,
	// 	};
	// }
}
