import { BaseElement, Element } from './element';

export default class Rectangle extends BaseElement implements Element {
	x: number;
	y: number;
	radius: number;
	start_angle: number;
	end_angle: number;
	color: string;

	constructor(props) {
		super(props);
		this.x = props.x;
		this.y = props.y;
		this.radius = props.radius;
		this.start_angle = props.start_angle;
		this.end_angle = props.end_angle;
		this.color = props.color;
	}

	draw(context) {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, this.start_angle, this.end_angle);
		context.fill();
	}

	collide(position) {
		return (this.x - position.x) ** 2 + (this.y - position.y) ** 2 < this.radius ** 2;
	}

	serialise() {
		return {
			x: this.x,
			y: this.y,
			radius: this.radius,
			start_angle: this.start_angle,
			end_angle: this.end_angle,
			color: this.color,
		};
	}
}
