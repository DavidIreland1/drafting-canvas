import Element from './element';
import Elements from './elements';

export default class Group extends Element {
	static create(id, position) {
		return Object.assign(super.create(id, position), {
			elements: [],
		});
	}

	static draw(group, context, cursor) {
		const center = this.center(group);
		context.translate(center.x, center.y);
		context.rotate(group.rotation);
		context.translate(-center.x, -center.y);

		const hovering = group.elements
			.filter((element) => element.visible)
			.reverse()
			.filter((element) => Elements[element.type].draw(element, context, cursor))
			.filter((element) => !element.locked);

		context.translate(center.x, center.y);
		context.rotate(-group.rotation);
		context.translate(-center.x, -center.y);

		return hovering.length > 0;
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

	static outline(group, context, color, line_width): void {
		const bounds = this.bound(group);
		const center = this.center(group);
		context.translate(center.x, center.y);
		context.rotate(group.rotation);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		context.stroke();

		context.rotate(-group.rotation);
		context.translate(-center.x, -center.y);
	}

	// static highlight(group, context: CanvasRenderingContext2D, cursor, color: string, line_width: number, box_size: number): boolean {
	// 	if (group.selected) super.highlight(group, context, cursor, color, line_width, box_size);
	// 	// group.elements.forEach((element) => {
	// 	// 	if (element.selected || element.type === 'group') Elements[element.type].highlight(element, context, color, line_width, box_size);
	// 	// });
	// 	return undefined;
	// }

	static getFill(group) {
		return group.elements.map((element) => Elements[element.type].getFill(element)).flat();
	}

	static setFill(group, colors) {
		group.elements.map((element) => Elements[element.type].setFill(element, colors));
	}

	static getStroke(group) {
		return group.elements.map((element) => Elements[element.type].getStroke(element)).flat();
	}

	static setStroke(group, colors) {
		group.elements.map((element) => Elements[element.type].setStroke(element, colors));
	}

	static move(group, position, last_position) {
		group.elements
			.filter((element) => !element.selected)
			.forEach((element) => {
				Elements[element.type].move(element, position, last_position);
			});
	}

	static resize(group, position, last_position) {
		// const group_center = this.center(group);
		// const oposite = {
		// 	x: group_center.x - (position.x - group_center.x),
		// 	y: group_center.y - (position.y - group_center.y),
		// };
		// const last_oposite = {
		// 	x: group_center.x - (last_position.x - group_center.x),
		// 	y: group_center.y - (last_position.y - group_center.y),
		// };

		group.elements.forEach((element) => {
			// const center = Elements[element.type].center(element);
			// const position = {
			// 	x: center.x - (oposite.x - center.x),
			// 	y: center.y - (oposite.y - center.y),
			// };
			// const last_position = {
			// 	x: center.x - (last_oposite.x - center.x),
			// 	y: center.y - (last_oposite.y - center.y),
			// };

			Elements[element.type].resize(element, position, last_position);
		});
	}
}
