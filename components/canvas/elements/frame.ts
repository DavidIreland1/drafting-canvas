import Element from './element';
import Elements from './elements';

export default class Frame extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Frame',
			type: 'frame',
			rotation: 0,
			elements: [],
			points: this.makePoints(position.x, position.y, 1, 1, 0),
			fill: [{ id: id + '2123', type: 'Solid', color: [0, 0, 1, 1], format: 'hex4', visible: true }],
		});
	}

	static draw(frame, context, cursor, view) {
		const hover = Element.draw(frame, context, cursor, view);
		const center = this.center(frame);
		const path = this.path(frame);
		context.save();
		context.clip(path);
		// context.translate(center.x, center.y);
		// context.rotate(frame.rotation);
		frame.elements
			.filter((element) => element.visible)
			.reverse()
			.filter((element) => Elements[element.type].draw(element, context, cursor, view))
			.filter((element) => !element.locked);

		context.restore();

		return hover;
	}

	// static draw(frame, context: CanvasRenderingContext2D, cursor, draw) {
	// 	const center = this.center(frame);

	// 	context.fillStyle = frame.color;
	// 	context.translate(center.x, center.y);
	// 	context.rotate(frame.rotation);

	// 	const path = this.path(frame);

	// 	this.fill(frame, context, path);
	// 	this.stroke(frame, context, path);

	// 	const hover = context.isPointInPath(path, cursor.x, cursor.y);

	// 	context.rotate(-frame.rotation);
	// 	context.translate(-center.x, -center.y);

	// 	const hover_child = frame.elements
	// 		.filter((element) => element.visible)
	// 		.reverse()
	// 		.filter((element) => Elements[element.type].draw(element, context, cursor, draw))
	// 		.filter((element) => !element.locked);

	// 	if (hover_child.length > 0) return hover_child.length > 0;
	// 	return hover;
	// }

	static getEffect(frame) {
		return frame.elements.map((element) => Elements[element.type].getEffect(element)).flat();
	}

	static setEffect(frame, colors) {
		frame.elements.forEach((element) => Elements[element.type].setEffect(element, colors));
	}

	static getPoints(frame) {
		return frame.points;
	}
}
