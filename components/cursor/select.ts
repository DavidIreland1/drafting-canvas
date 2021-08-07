import Settings from './../settings';

export default class Select {
	static draw(cursor, context: CanvasRenderingContext2D, view) {
		if (cursor.id === Settings.user_id) return (context.canvas.style.cursor = '');

		context.translate(cursor.x, cursor.y);
		context.scale(1 / view.scale, 1 / view.scale);
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

		context.fillStyle = cursor.color;
		context.shadowColor = 'transparent';
		context.fill();

		context.font = '25px Arial';
		const width = context.measureText(cursor.label);

		context.fillRect(cursor.x + 15, cursor.y + 35, width.width + 10, 35);
		context.fillStyle = 'white';
		context.fillText(cursor.label, cursor.x + 20, cursor.y + 60);

		context.translate(cursor.x, cursor.y);
		context.scale(view.scale, view.scale);
		context.translate(-cursor.x, -cursor.y);
	}
}
