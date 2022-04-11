import Element from './element';

export default class Rectangle extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Rectangle',
			type: 'rectangle',
			rotation: 0,
			points: this.makePoints(position.x, position.y, 1, 1, 0),
		});
	}

	static makePoints(x, y, width, height, radius) {
		return [
			{ x: x, y: y },
			{ x: x + width, y: y },
			{ x: x + width, y: y + height },
			{ x: x, y: y + height },
		].map((point, i) => ({ ...point, i, radius, controls: [] }));
	}

	static stretch(rectangle, position, last_position): void {
		// const center = this.center(rectangle);
		// const bounds = this.bound(rectangle);
		// const opposite = reflectPoint(last_position, center);
		// const new_center = {
		// 	x: (opposite.x + position.x) / 2,
		// 	y: (opposite.y + position.y) / 2,
		// };
		// const new_opposite = rotatePoint(opposite, new_center, -rectangle.rotation);
		// const new_position = rotatePoint(position, new_center, -rectangle.rotation);
		// rectangle.x = new_opposite.x;
		// rectangle.y = new_opposite.y;
		// rectangle.width = new_position.x - new_opposite.x;
		// rectangle.height = new_position.y - new_opposite.y;
		// // rectangle.points = this.makePoints(rectangle);
	}
}

// function getClosest(points, position) {
// 	return points.map((point) => ({ ...point, delta: Math.abs(point.x - position.x) + Math.abs(point.y - position.y) })).sort((point1, point2) => point1.delta + point2.delta)[0];
// }

// function average(arr) {
// 	return arr.reduce((a, b) => a + b, 0) / arr.length;
// }

////////

// const distance = (last_point, this_point) => Math.sqrt((last_point.x - this_point.x) ** 2 + (last_point.y - this_point.y) ** 2);
// const linearInterpolation = (a, b, x) => a + (b - a) * x;
// const linearInterpolation2D = (last_point, this_point, t) => ({
// 	x: linearInterpolation(last_point.x, this_point.x, t),
// 	y: linearInterpolation(last_point.y, this_point.y, t),
// });

// function roundedPoly(points, radius) {
// 	const path = new Path2D();
// 	const num_points = points.length;

// 	points.forEach((last_point, i, points) => {
// 		const this_point = points[(i + 1) % num_points];
// 		const next_point = points[(i + 2) % num_points];

// 		const lastEdgeLength = distance(last_point, this_point);
// 		const lastOffsetDistance = Math.min(lastEdgeLength / 2, radius);
// 		const start = linearInterpolation2D(this_point, last_point, lastOffsetDistance / lastEdgeLength);

// 		const nextEdgeLength = distance(next_point, this_point);
// 		const nextOffsetDistance = Math.min(nextEdgeLength / 2, radius);
// 		const end = linearInterpolation2D(this_point, next_point, nextOffsetDistance / nextEdgeLength);

// 		const control_point = linearInterpolation2D(start, this_point, 1);

// 		path.lineTo(start.x, start.y);
// 		path.quadraticCurveTo(control_point.x, control_point.y, end.x, end.y);
// 	});
// 	path.closePath();

// 	return path;
// }
