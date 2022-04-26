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
}

// function getClosest(points, position) {
// 	return points.map((point) => ({ ...point, delta: Math.abs(point.x - position.x) + Math.abs(point.y - position.y) })).sort((point1, point2) => point1.delta + point2.delta)[0];
// }

// function average(arr) {
// 	return arr.reduce((a, b) => a + b, 0) / arr.length;
// }
