export default class Select {
	static draw(cursor, context, view) {
		context.translate(cursor.x, cursor.y);
		context.scale(1 / view.scale, 1 / view.scale);
		context.translate(-cursor.x, -cursor.y);

		context.beginPath();
		context.moveTo(cursor.x, cursor.y);
		context.lineTo(cursor.x + 4, cursor.y + 30);
		context.lineTo(cursor.x + 13, cursor.y + 22);
		context.lineTo(cursor.x + 26, cursor.y + 18);
		context.lineTo(cursor.x, cursor.y);

		context.shadowColor = 'black';
		context.strokeStyle = 'white';
		context.shadowBlur = 2;
		context.shadowOffsetX = 1;
		context.shadowOffsetY = 1;
		context.lineWidth = 3;
		context.stroke();
		context.shadowColor = 'transparent';

		context.fillStyle = 'black';
		context.fill();

		context.translate(cursor.x, cursor.y);
		context.scale(view.scale, view.scale);
		context.translate(-cursor.x, -cursor.y);
	}
}
