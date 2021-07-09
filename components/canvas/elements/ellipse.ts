import { BaseElement, Element } from './element';

export default class Ellipse extends BaseElement implements Element {
	x: number;
	y: number;
	radius_x: number;
	radius_y: number;
	rotation: number;
	start_angle: number;
	end_angle: number;
	counter_clockwise: boolean;
	color: string;

	constructor(props) {
		super(props);
		this.x = props.x;
		this.y = props.y;
		this.radius_x = props.radius_x;
		this.radius_y = props.radius_y;
		this.rotation = props.rotation;
		this.start_angle = props.start_angle;
		this.end_angle = props.end_angle;
		this.counter_clockwise = props.counter_clockwise;
		this.color = props.color;
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = this.color;
		context.beginPath();
		context.ellipse(this.x, this.y, this.radius_x, this.radius_y, this.rotation, this.start_angle, this.end_angle, this.counter_clockwise);
		context.fill();

		// context.globalCompositeOperation = 'destination-out';
		// context.beginPath();
		// context.ellipse(this.x, this.y, this.radius_x, this.radius_y, this.start_angle, this.end_angle);
		// context.fill();
		// context.globalCompositeOperation = 'source-over';
	}

	outline(context, view) {
		context.strokeStyle = 'blue';
		context.lineWidth = 2 / view.scale;
		context.beginPath();
		context.ellipse(this.x, this.y, this.radius_x, this.radius_y, this.rotation, this.start_angle, this.end_angle, this.counter_clockwise);
		context.stroke();
	}

	highlight(context, view) {
		if (this.hover || this.selected) {
			context.strokeStyle = 'blue';
			context.lineWidth = 1 / view.scale;
			const bounds = this.bounds();
			context.beginPath();
			context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
			context.stroke();
		}
	}

	collide(position) {
		return (this.x - position.x) ** 2 / this.radius_x ** 2 + (this.y - position.y) ** 2 / this.radius_y ** 2 < 1;
	}

	bounds(): { x: number; y: number; width: number; height: number } {
		return {
			x: this.x - this.radius_x,
			y: this.y - this.radius_y,
			width: this.radius_x * 2,
			height: this.radius_y * 2,
		};
	}

	serialise() {
		return {
			type: 'ellipse',
			id: this.id,
			x: this.x,
			y: this.y,
			radius_x: this.radius_x,
			radius_y: this.radius_y,
			start_angle: this.start_angle,
			end_angle: this.end_angle,
			color: this.color,
		};
	}
}
