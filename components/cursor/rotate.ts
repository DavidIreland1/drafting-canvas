export default class Resize {
	static draw(cursor, context, scale) {
		const head_length = 5;
		const body_length = 15;
		const width = 3;
		const rotation = Math.PI / 8;

		context.translate(cursor.x, cursor.y);
		context.scale(1 / scale, 1 / scale);
		context.rotate(cursor.rotation + rotation);
		context.translate(-cursor.x, -cursor.y);

		context.beginPath();
		context.moveTo(cursor.x + head_length - body_length / 2, cursor.y - body_length + head_length);
		context.lineTo(cursor.x - body_length / 2, cursor.y - body_length);
		context.lineTo(cursor.x - head_length - body_length / 2, cursor.y - body_length + head_length);

		context.moveTo(cursor.x - body_length / 2, cursor.y - body_length);

		context.arc(cursor.x + body_length * 1.5, cursor.y - body_length / 2, body_length * 2, 3.1, 2.2, true);

		context.moveTo(cursor.x + body_length / 2 - 3, cursor.y + body_length - head_length * 1.41 + 2);
		context.lineTo(cursor.x + body_length / 2 - 3, cursor.y + body_length + 2);
		context.lineTo(cursor.x + body_length / 2 - 3 - head_length * 1.41, cursor.y + body_length + 2);

		context.strokeStyle = 'white';
		context.lineWidth = width * 2;
		context.stroke();

		context.strokeStyle = 'black';
		context.lineWidth = width;
		context.stroke();

		context.translate(cursor.x, cursor.y);
		context.rotate(-cursor.rotation - rotation);
		context.scale(scale, scale);
		context.translate(-cursor.x, -cursor.y);
	}
}
