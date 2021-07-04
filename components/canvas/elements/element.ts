export class BaseElement {
	selected: boolean;
	hover: boolean;

	constructor() {
		this.selected = false;
		this.hover = false;
	}
}

export interface Element {
	draw(constext: CanvasRenderingContext2D, view): void;
	collide(position: { x: number; y: number }): Object;

	serialise(): Object;
}
