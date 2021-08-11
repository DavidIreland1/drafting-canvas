import Line from './line';

export default class Arrow extends Line {
	static create(id, position) {
		return Object.assign(super.create(id, position), {
			label: 'Arrow',
			type: 'arrow',
		});
	}

	static draw(arrow, context: CanvasRenderingContext2D, cursor) {
		const theta = Math.atan2(arrow.y2 - arrow.y1, arrow.x2 - arrow.x1);
		context.beginPath();
		context.moveTo(arrow.x1, arrow.y1);
		context.lineTo(arrow.x2 - arrow.head_length * Math.cos(theta) * Math.cos(arrow.head_angle), arrow.y2 - arrow.head_length * Math.sin(theta) * Math.cos(arrow.head_angle));
		context.stroke();

		context.moveTo(arrow.x2, arrow.y2);
		context.lineTo(arrow.x2 - arrow.head_length * Math.cos(theta - arrow.head_angle), arrow.y2 - arrow.head_length * Math.sin(theta - arrow.head_angle));
		context.lineTo(arrow.x2 - arrow.head_length * Math.cos(theta + arrow.head_angle), arrow.y2 - arrow.head_length * Math.sin(theta + arrow.head_angle));
		context.fill();

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static outarrow(arrow, context, color, arrow_width): void {
		context.strokeStyle = color;
		context.arrowWidth = arrow_width;

		const theta = Math.atan2(arrow.y2 - arrow.y1, arrow.x2 - arrow.x1);
		context.beginPath();
		context.moveTo(arrow.x1, arrow.y1);
		context.lineTo(arrow.x2 - arrow.head_length * Math.cos(theta) * Math.cos(arrow.head_angle), arrow.y2 - arrow.head_length * Math.sin(theta) * Math.cos(arrow.head_angle));
		context.stroke();

		context.moveTo(arrow.x2, arrow.y2);
		context.lineTo(arrow.x2 - arrow.head_length * Math.cos(theta - arrow.head_angle), arrow.y2 - arrow.head_length * Math.sin(theta - arrow.head_angle));
		context.lineTo(arrow.x2 - arrow.head_length * Math.cos(theta + arrow.head_angle), arrow.y2 - arrow.head_length * Math.sin(theta + arrow.head_angle));
		context.fill();
	}

	static resize(arrow, position, last_position): void {}

	static stretch(arrow, position, last_position): void {}
}
