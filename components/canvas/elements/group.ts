import Element from './element';
import Elements from './elements';

export default class Group extends Element {
	static draw(group, context) {
		group.elements.forEach((element) => Elements[element.type].draw(element, context));
	}

	static bound(group) {
		const positions = group.elements.map((element) => Elements[element.type].bound(element));

		const min_x = positions.reduce((x, position) => Math.min(x, position.x), Number.MAX_SAFE_INTEGER);
		const min_y = positions.reduce((y, position) => Math.min(y, position.y), Number.MAX_SAFE_INTEGER);
		return {
			x: min_x,
			y: min_y,
			width: positions.reduce((x, position) => Math.max(x, position.x + position.width), Number.MIN_SAFE_INTEGER) - min_x,
			height: positions.reduce((y, position) => Math.max(y, position.y + position.height), Number.MIN_SAFE_INTEGER) - min_y,
		};
	}

	static move(group, position, last_position) {
		group.elements.forEach((element) => {
			Elements[element.type].move(element, position, last_position);
		});
	}

	static collide(group, position: { x: number; y: number }): boolean {
		const target = group.elements.find((element) => Elements[element.type].collide(element, position));
		return target ? true : false;
	}
}
