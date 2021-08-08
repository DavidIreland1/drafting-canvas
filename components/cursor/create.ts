export default class Resize {
	static draw(cursor, context, view) {
		const body_length = 17;
		const width = 3;

		context.translate(cursor.x, cursor.y);
		context.scale(1 / view.scale, 1 / view.scale);
		context.translate(-cursor.x, -cursor.y);

		context.beginPath();

		context.rect(cursor.x - width, cursor.y - body_length, width, body_length * 2);

		context.rect(cursor.x - body_length, cursor.y - width, body_length * 2, width);

		context.strokeStyle = 'white';
		context.lineWidth = width;
		context.stroke();

		context.shadowColor = 'transparent';
		context.fillStyle = 'black';
		context.fill();

		context.translate(cursor.x, cursor.y);
		context.scale(view.scale, view.scale);
		context.translate(-cursor.x, -cursor.y);
	}
}
