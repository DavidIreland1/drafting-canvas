import Element from './element';
import Elements from './elements';

export default class Group extends Element {
	static draw(group, context, cursor) {
		const center = this.center(group);
		context.translate(center.x, center.y);
		context.rotate(group.rotation);
		context.translate(-center.x, -center.y);

		const hovering = group.elements.filter((element) => Elements[element.type].draw(element, context, cursor));

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

	static move(group, position, last_position) {
		group.elements.forEach((element) => {
			Elements[element.type].move(element, position, last_position);
		});
	}

	static resize(group, position, last_position) {
		group.elements.forEach((element) => {
			Elements[element.type].resize(element, position, last_position);
		});
	}
}
