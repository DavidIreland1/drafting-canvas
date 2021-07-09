import { BaseElement, Element } from './element';
import { initElement } from '../init';

export default class Group extends BaseElement implements Element {
	elements: Array<BaseElement>;

	constructor(props) {
		super(props);
		this.elements = props.elements.map(initElement);
	}

	draw(context) {
		this.elements.forEach((element) => {
			element.draw(context);
		});
	}

	outline(context, view) {
		context.strokeStyle = 'blue';
		context.lineWidth = 2 / view.scale;
		const bounds = this.bounds();
		context.beginPath();
		context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
		context.stroke();
	}

	highlight(context, view) {
		context.strokeStyle = 'blue';
		context.lineWidth = 1 / view.scale;
		const bounds = this.bounds();
		context.beginPath();
		context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
		context.stroke();
	}

	bounds() {
		const positions = this.elements.map((element) => element.bounds());

		const min_x = positions.reduce((x, position) => Math.min(x, position.x), Number.MAX_SAFE_INTEGER);
		const min_y = positions.reduce((y, position) => Math.min(y, position.y), Number.MAX_SAFE_INTEGER);
		return {
			x: min_x,
			y: min_y,
			width: positions.reduce((x, position) => Math.max(x, position.x + position.width), Number.MIN_SAFE_INTEGER) - min_x,
			height: positions.reduce((y, position) => Math.max(y, position.y + position.height), Number.MIN_SAFE_INTEGER) - min_y,
		};
	}

	move(delta_x: number, delta_y: number) {
		this.elements.forEach((element) => {
			element.move(delta_x, delta_y);
		});
	}

	collide(position: { x: number; y: number }): boolean {
		const target = this.elements.find((element) => element.collide(position));
		return target ? true : false;
	}

	serialise() {
		return {
			type: 'group',
			id: this.id,
			elements: this.elements.map((element) => element.serialise()),
		};
	}
}
