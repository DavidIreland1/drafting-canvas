export default class Select {
	static draw(cursor, context: CanvasRenderingContext2D, scale) {
		context.translate(cursor.x, cursor.y);
		context.scale(1 / scale, 1 / scale);
		context.translate(-cursor.x, -cursor.y);

		context.beginPath();
		context.moveTo(cursor.x, cursor.y);
		context.lineTo(cursor.x, cursor.y + 34);
		context.lineTo(cursor.x + 12, cursor.y + 26);
		context.lineTo(cursor.x + 25, cursor.y + 24);
		context.lineTo(cursor.x, cursor.y);

		context.shadowColor = 'black';
		context.strokeStyle = 'white';
		context.shadowBlur = 3;
		context.shadowOffsetX = 1;
		context.shadowOffsetY = 1;
		context.lineWidth = 3;
		context.stroke();

		context.shadowColor = 'transparent';
		context.fillStyle = cursor.color;
		context.fill();

		context.translate(cursor.x, cursor.y);
		context.scale(scale, scale);
		context.translate(-cursor.x, -cursor.y);
	}
}
