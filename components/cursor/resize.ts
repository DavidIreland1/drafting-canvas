export default class Resize {
	static draw(cursor, context, view) {
		const head_length = 5;
		const body_length = 15;

		const rotation = Math.PI / 2;

		context.translate(cursor.x, cursor.y);
		context.scale(1 / view.scale, 1 / view.scale);
		context.rotate(cursor.rotation + rotation);
		context.translate(-cursor.x, -cursor.y);

		context.beginPath();
		context.moveTo(cursor.x + head_length, cursor.y - body_length + head_length);
		context.lineTo(cursor.x, cursor.y - body_length);
		context.lineTo(cursor.x - head_length, cursor.y - body_length + head_length);

		context.moveTo(cursor.x + head_length, cursor.y + body_length - head_length);
		context.lineTo(cursor.x, cursor.y + body_length);
		context.lineTo(cursor.x - head_length, cursor.y + body_length - head_length);

		context.moveTo(cursor.x, cursor.y + body_length);
		context.lineTo(cursor.x, cursor.y - body_length);

		context.strokeStyle = 'white';
		context.lineWidth = 6;
		context.stroke();

		context.strokeStyle = 'black';
		context.lineWidth = 3;
		context.stroke();

		context.translate(cursor.x, cursor.y);
		context.rotate(-cursor.rotation - rotation);
		context.scale(view.scale, view.scale);
		context.translate(-cursor.x, -cursor.y);
	}
}
