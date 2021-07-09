export class BaseElement implements Element {
	id: string;
	x: number;
	y: number;
	selected: boolean;
	hover: boolean;

	constructor(props) {
		this.id = props.id;
		this.selected = false;
		this.hover = false;
	}

	draw(context: CanvasRenderingContext2D): void {
		return;
	}

	collide(position: { x: number; y: number }): boolean {
		return false;
	}

	serialise() {
		return {};
	}

	bounds(): { x: number; y: number; width: number; height: number } {
		return { x: 0, y: 0, width: 0, height: 0 };
	}

	move(delta_x: number, delta_y: number): void {
		this.x += delta_x;
		this.y += delta_y;
	}
}

export interface Element {
	draw(context: CanvasRenderingContext2D): void;
	collide(position: { x: number; y: number }): Object;
	move(delta_x: number, delta_y: number);
	serialise(): Object;
	bounds(): { x: number; y: number; width: number; height: number };
}
