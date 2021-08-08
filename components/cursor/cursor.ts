import Select from './select';
import Stretch from './stretch';
import Resize from './resize';
import Rotate from './rotate';
import Create from './create';

import Settings from './../settings';

const Cursors = {
	select: Select,
	move: Select,
	stretch: Stretch,
	resize: Resize,
	rotate: Rotate,

	rectangle: Create,
	line: Create,
	ellipse: Create,
};

export default class Cursor {
	static draw(cursor, context, view) {
		if (cursor.id === Settings.user_id) {
			if (cursor.type === 'select') {
				context.canvas.style.cursor = '';
			} else {
				context.canvas.style.cursor = 'none';
				Cursors[cursor.type].draw(cursor, context, view);
			}
			return;
		}

		Select.draw(cursor, context, view);
		drawLabel(cursor, context, view);
	}
}

function drawLabel(cursor, context, view) {
	context.translate(cursor.x, cursor.y);
	context.scale(1 / view.scale, 1 / view.scale);
	context.translate(-cursor.x, -cursor.y);
	context.beginPath();

	context.font = '25px Arial';
	const width = context.measureText(cursor.label);

	context.fillStyle = cursor.color;
	context.fillRect(cursor.x + 15, cursor.y + 35, width.width + 10, 35);
	context.fillStyle = 'white';
	context.fillText(cursor.label, cursor.x + 20, cursor.y + 60);

	context.translate(cursor.x, cursor.y);
	context.scale(view.scale, view.scale);
	context.translate(-cursor.x, -cursor.y);
}
