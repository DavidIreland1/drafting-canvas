import Element from './element';

export default class Line extends Element {
	static draw(line, context: CanvasRenderingContext2D, cursor) {
		const theta = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
		context.beginPath();
		context.moveTo(line.x1, line.y1);
		context.lineTo(line.x2 - line.head_length * Math.cos(theta) * Math.cos(line.head_angle), line.y2 - line.head_length * Math.sin(theta) * Math.cos(line.head_angle));
		context.stroke();

		context.moveTo(line.x2, line.y2);
		context.lineTo(line.x2 - line.head_length * Math.cos(theta - line.head_angle), line.y2 - line.head_length * Math.sin(theta - line.head_angle));
		context.lineTo(line.x2 - line.head_length * Math.cos(theta + line.head_angle), line.y2 - line.head_length * Math.sin(theta + line.head_angle));
		context.fill();

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static outline(line, context, color, line_width): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;

		const theta = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
		context.beginPath();
		context.moveTo(line.x1, line.y1);
		context.lineTo(line.x2 - line.head_length * Math.cos(theta) * Math.cos(line.head_angle), line.y2 - line.head_length * Math.sin(theta) * Math.cos(line.head_angle));
		context.stroke();

		context.moveTo(line.x2, line.y2);
		context.lineTo(line.x2 - line.head_length * Math.cos(theta - line.head_angle), line.y2 - line.head_length * Math.sin(theta - line.head_angle));
		context.lineTo(line.x2 - line.head_length * Math.cos(theta + line.head_angle), line.y2 - line.head_length * Math.sin(theta + line.head_angle));
		context.fill();
	}

	static bound(line): { x: number; y: number; width: number; height: number } {
		return {
			x: Math.min(line.x1, line.x2),
			y: Math.min(line.y1, line.y2),
			width: Math.max(line.x1, line.x2),
			height: Math.max(line.y1, line.y2),
		};
	}

	static resize(line, position, last_position): void {}

	static stretch(line, position, last_position): void {}
}
