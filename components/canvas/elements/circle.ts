import { BaseElement, Element } from './element';

export default class Circle extends BaseElement implements Element {
	x: number;
	y: number;
	radius: number;
	start_angle: number;
	end_angle: number;
	color: string;

	constructor(props) {
		super();
		this.x = props.x;
		this.y = props.y;
		this.radius = props.radius;
		this.start_angle = props.start_angle;
		this.end_angle = props.end_angle;
		this.color = props.color;
	}

	draw(context, view) {
		if (this.hover || this.selected) {
			context.strokeStyle = this.selected ? 'blue' : 'green';
			context.lineWidth = 5 / view.scale;
			context.beginPath();
			context.arc(this.x, this.y, this.radius, this.start_angle, this.end_angle);
			context.stroke();
			this.hover = false;
		}

		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, this.start_angle, this.end_angle);
		context.fill();

		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.arc(this.x, this.y, this.radius * 0.2, this.start_angle, this.end_angle);
		context.fill();
		context.globalCompositeOperation = 'source-over';
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
