import { BaseElement, Element } from './element';
import { initElement } from '../init';

export default class Group extends BaseElement implements Element {
	elements: Array<Element>;

	constructor(props) {
		super();

		this.elements = props.elements.map(initElement);
	}

	draw(context, view) {
		this.elements.forEach((element) => {
			element.draw(context, view);
		});
	}

	collide(position: { x: number; y: number }): Object {
		return this.elements.find((element) => element.collide(position));
	}

	serialise() {
		return {
			elements: this.elements.map((element) => element.serialise()),
		};
	}
}
