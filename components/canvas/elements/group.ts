import Element from './element';
import Elements from './elements';

export default class Group extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			elements: [],
		});
	}

	static draw(group, context, cursor, view) {
		const hovering = group.elements
			.filter((element) => element.visible)
			.reverse()
			.map((element) => Elements[element.type].draw(element, context, cursor, view))
			.filter((element) => element && !element.locked)
			.reverse();

		if (group.editing) {
			return hovering[0];
		} else {
			return hovering.length > 0 ? group : undefined;
		}
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

	static getFill(group) {
		return group.elements.map((element) => Elements[element.type].getFill(element)).flat();
	}

	static setFill(group, colors) {
		group.elements.forEach((element) => Elements[element.type].setFill(element, colors));
	}

	static getStroke(group) {
		return group.elements.map((element) => Elements[element.type].getStroke(element)).flat();
	}

	static setStroke(group, colors) {
		group.elements.forEach((element) => Elements[element.type].setStroke(element, colors));
	}

	static getEffect(group) {
		return group.elements.map((element) => Elements[element.type].getEffect(element)).flat();
	}

	static setEffect(group, colors) {
		group.elements.forEach((element) => Elements[element.type].setEffect(element, colors));
	}

	static getPoints(group) {
		return group.elements.map((element) => Elements[element.type].getPoints(element)).flat();
	}
}
