export default class Cursor {
	static draw(cursor, context, view) {
		context.fillStyle = 'black';
		switch (cursor.type) {
			case 'select':
				context.fillStyle = 'black';

				break;
			case 'move':
				context.fillStyle = 'yellow';

				break;
			case 'resize':
				context.fillStyle = 'red';

				break;
			case 'rotate':
				context.fillStyle = 'blue';
				break;

			case 'none':
				return;
		}
		context.strokeStyle = 'white';
		context.lineWidth = 2 / view.scale;
		context.beginPath();
		context.moveTo(cursor.x, cursor.y);
		context.lineTo(cursor.x + 3 / view.scale, cursor.y + 30 / view.scale);
		context.lineTo(cursor.x + 11 / view.scale, cursor.y + 20 / view.scale);
		// context.lineTo(cursor.x + 18 / view.scale, cursor.y + 35 / view.scale);
		context.lineTo(cursor.x + 26 / view.scale, cursor.y + 20 / view.scale);
		context.lineTo(cursor.x, cursor.y);
		context.fill();
		context.stroke();
	}
}
