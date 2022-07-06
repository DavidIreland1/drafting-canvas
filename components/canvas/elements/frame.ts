import { View } from '../../../types/user-types';
import Element from './element';
import Elements from './elements';

export default class Frame extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			label: 'Frame',
			type: 'frame',
			rotation: 0,
			elements: [],
			fill: [{ id: id + '2123', type: 'Solid', color: [0, 0, 1, 1], format: 'hex4', visible: true }],
		});
	}

	static draw(frame, context, cursor, view: View) {
		const hover = Element.draw(frame, context, cursor, view);
		const path = this.path(frame);
		context.save();
		context.clip(path);
		frame.elements
			.filter((element) => element.visible)
			.reverse()
			.filter((element) => Elements[element.type].draw(element, context, cursor, view))
			.filter((element) => !element.locked);

		context.restore();
		return hover ? frame : undefined;
	}

	static getPoints(frame) {
		return frame.points.concat(frame.elements.map((element) => Elements[element.type].getPoints(element)).flat());
	}

	static getEffect(frame) {
		return frame.elements.map((element) => Elements[element.type].getEffect(element)).flat();
	}

	static setEffect(frame, colors) {
		frame.elements.forEach((element) => Elements[element.type].setEffect(element, colors));
	}
}
