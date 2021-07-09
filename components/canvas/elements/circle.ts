import { BaseElement, Element } from './element';

export default class Circle extends BaseElement implements Element {
	x: number;
	y: number;
	radius: number;
	start_angle: number;
	end_angle: number;
	counter_clockwise: boolean;
	color: string;

	constructor(props) {
		super(props);
		this.id = props.id;
		this.x = props.x;
		this.y = props.y;
		this.radius = props.radius;
		this.start_angle = props.start_angle;
		this.end_angle = props.end_angle;
		this.counter_clockwise = props.counter_clockwise;
		this.color = props.color;
	}

	draw(context) {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, this.start_angle, this.end_angle, this.counter_clockwise);
		context.fill();

		// context.globalCompositeOperation = 'destination-out';
		// context.beginPath();
		// context.arc(this.x, this.y, this.radius * 0.2, this.start_angle, this.end_angle);
		// context.fill();
		// context.globalCompositeOperation = 'source-over';
	}

	outline(context, view) {
		context.strokeStyle = 'blue';
		context.lineWidth = 2 / view.scale;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, this.start_angle, this.end_angle);
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

	collide(position) {
		return (this.x - position.x) ** 2 + (this.y - position.y) ** 2 < this.radius ** 2;
	}

	bounds(): { x: number; y: number; width: number; height: number } {
		return {
			x: this.x - this.radius,
			y: this.y - this.radius,
			width: this.radius * 2,
			height: this.radius * 2,
		};
	}

	serialise() {
		return {
			type: 'circle',
			id: this.id,
			x: this.x,
			y: this.y,
			radius: this.radius,
			start_angle: this.start_angle,
			end_angle: this.end_angle,
			color: this.color,
		};
	}
}
