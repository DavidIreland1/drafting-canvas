import Element from './element';

export default class Bezier extends Element {
	static create(id, position) {
		return Object.assign(super.create(id, position), {
			curves: [
				{
					x1: position.x - 1,
					y1: position.y - 1,
					x1cp: position.x,
					y1cp: position.y,

					x2: position.x + 200,
					y2: position.y + 200,
					x2cp: position.x,
					y2cp: position.y - 100,
				},
				{
					x1: position.x + 200,
					y1: position.y + 200,
					x1cp: position.x + 100 + 200,
					y1cp: position.y + 200,
					x2: position.x + 400,
					y2: position.y + 400,
					x2cp: position.x + 200,
					y2cp: position.y - 100 + 200,
				},
				{
					x1: position.x + 400,
					y1: position.y + 200,
					x1cp: position.x + 1400 + 200,
					y1cp: position.y + 200,
					x2: position.x + 800,
					y2: position.y + 400,
					x2cp: position.x + 800,
					y2cp: position.y - 100 + 200,
				},
			],
			label: 'Spline',
			type: 'spline',
			fill: [],
			stroke: [{ id: id + '564', width: 10, color: [0.2, 0.2, 0.2, 1] }],
		});
	}

	static path(line) {
		const path = new Path2D();

		let last_curve = { x2: undefined, y2: undefined };

		line.curves.forEach((curve) => {
			if (!curve.x2) return;
			if (last_curve.x2 !== curve.x1 || last_curve.y2 !== curve.y1) path.moveTo(curve.x1, curve.y1);
			path.bezierCurveTo(curve.x1cp, curve.y1cp, curve.x2cp, curve.y2cp, curve.x2, curve.y2);
			last_curve = curve;
		});

		return path;
	}

	static draw(line, context: CanvasRenderingContext2D, cursor) {
		const path = this.path(line);

		this.fill(line, context, path);
		this.stroke(line, context, path);

		// context.lineWidth = line.stroke.reduce((max, stroke) => Math.max(max, stroke.width), 0);

		return context.isPointInStroke(path, cursor.x, cursor.y);
	}

	static outline(line, context: CanvasRenderingContext2D, color, line_width) {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		const path = this.path(line);
		context.stroke(path);
	}

	static drawBound(line, context: CanvasRenderingContext2D, cursor, color, line_width) {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();

		line.curves.forEach((point) => {
			context.moveTo(point.x1, point.y1);
			context.lineTo(point.x1cp, point.y1cp);

			context.moveTo(point.x2, point.y2);
			context.lineTo(point.x2cp, point.y2cp);
		});

		context.stroke();
		return false;
	}

	static drawRotate(line, context, cursor, box_size) {
		return false;
	}

	static drawResize(line, context, cursor, highlight, line_width, box_size) {
		context.fillStyle = 'white';
		context.strokeStyle = highlight;
		context.lineWidth = line_width;
		context.beginPath();
		const angle = 0;

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

	static bound(line): { x: number; y: number; width: number; height: number } {
		const xs = line.curves.map((point) => point.x);
		const ys = line.curves.map((point) => point.y);

		const min_x = Math.min(...xs);
		const min_y = Math.min(...ys);

		const max_x = Math.max(...xs);
		const max_y = Math.max(...ys);
		return {
			x: min_x,
			y: min_y,
			width: max_x - min_x,
			height: max_y - min_y,
		};
	}

	static move(line, position, last_position) {
		const delta_x = position.x - last_position.x;
		const delta_y = position.y - last_position.y;

		line.curves.forEach((point) => {
			point.x1 += delta_x;
			point.y1 += delta_y;
			point.x1cp += delta_x;
			point.y1cp += delta_y;
			point.y2 += delta_y;
			point.x2 += delta_x;
			point.x2cp += delta_x;
			point.y2cp += delta_y;
		});
	}

	static resize(line, position, last_position): void {
		const closeset_curve = this.closesetCurve(line, last_position);

		closeset_curve.forEach((curve) => {
			const target = line.curves[curve.index];

			const delta_x = Math.round(position.x) - target['x' + curve.point];
			const delta_y = Math.round(position.y) - target['y' + curve.point];

			target['x' + curve.point] = Math.round(position.x);
			target['y' + curve.point] = Math.round(position.y);

			if (curve.point === '1') {
				target.x1cp += delta_x;
				target.y1cp += delta_y;
			} else if (curve.point === '2') {
				target.x2cp += delta_x;
				target.y2cp += delta_y;
			} else if (curve.point === '1cp') {
				let prev_index = curve.index - 1;
				if (prev_index === -1) prev_index = line.curves.length - 1;
				if (line.curves[curve.index].x1 !== line.curves[prev_index].x2 || line.curves[curve.index].y1 !== line.curves[prev_index].y2) return;
				const prev_curve = line.curves[prev_index];
				prev_curve.x2cp = prev_curve.x2 - (target.x1cp - prev_curve.x2);
				prev_curve.y2cp = prev_curve.y2 - (target.y1cp - prev_curve.y2);
			} else if (curve.point === '2cp') {
				let next_index = curve.index + 1;
				if (next_index === line.curves.length) next_index = 0;
				if (line.curves[curve.index].x2 !== line.curves[next_index].x1 || line.curves[curve.index].y2 !== line.curves[next_index].y1) return;
				const next_curve = line.curves[next_index];
				next_curve.x1cp = next_curve.x1 - (target.x2cp - next_curve.x1);
				next_curve.y1cp = next_curve.y1 - (target.y2cp - next_curve.y1);
			}
		});
	}

	static closesetCurve(line, position): Array<{ index: number; point: string }> {
		const points = this.boxes(line, 0)
			.reverse()
			.map((point) => {
				point.distance = (point.x - position.x) ** 2 + (point.y - position.y) ** 2;
				return point;
			});
		const min_distance = Math.min(...points.map((point) => point.distance));

		const closetest_points = points.filter((points) => points.distance === min_distance);

		// Only allow 1 point per curve
		const curves = new Map(closetest_points.map((point) => [point.index, point])).values();

		return [...curves] as any;
	}

	static rotate(line, position, last_position) {
		return 0;
	}

	static rotatePoint(position, center, rotation) {
		return {
			x: (position.x - center.x) * Math.cos(rotation) - (position.y - center.y) * Math.sin(rotation) + center.x,
			y: (position.x - center.x) * Math.sin(rotation) + (position.y - center.y) * Math.cos(rotation) + center.y,
		};
	}

	static stretch(line, position, last_position): void {}

	static boxes(line, box_size) {
		return line.curves
			.map((point, i) => [
				{
					point: '1',
					index: i,
					id: line.id,
					x: point.x1,
					y: point.y1,
					width: box_size,
					height: box_size,
				},
				{
					point: '1cp',
					index: i,
					id: line.id,
					x: point.x1cp,
					y: point.y1cp,
					width: box_size,
					height: box_size,
				},
				{
					point: '2',
					index: i,
					id: line.id,
					x: point.x2,
					y: point.y2,
					width: box_size,
					height: box_size,
				},
				{
					point: '2cp',
					index: i,
					id: line.id,
					x: point.x2cp,
					y: point.y2cp,
					width: box_size,
					height: box_size,
				},
			])
			.flat();
	}
}
