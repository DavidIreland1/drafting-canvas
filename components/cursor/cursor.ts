import Select from './select';
import Stretch from './stretch';
import Resize from './resize';
import Rotate from './rotate';
import Create from './create';

import Settings from './../settings';
import { View } from '../../types/user-types';

const Cursors = {
	select: Select,
	move: Select,
	movePoints: Select,

	pen: Select,

	stretchX: Stretch,
	stretchY: Stretch,

	resize: Resize,
	rotate: Rotate,

	rectangle: Create,
	line: Create,
	ellipse: Create,
	bezier: Create,
	frame: Create,
	text: Create,
};

export default class Cursor {
	static draw(cursor, context, view: View) {
		const scale = (view.scale / window.devicePixelRatio) * 2;
		if (cursor.id === Settings.user.id) {
			if (Cursors[cursor.type] === Select) {
				context.canvas.style.cursor = '';
			} else {
				context.canvas.style.cursor = 'none';
				Cursors[cursor.type].draw(cursor, context, scale);
			}
		} else {
			Select.draw(cursor, context, scale);
			drawLabel(cursor, context, scale);
		}
	}
}

function drawLabel(cursor, context, scale) {
	context.translate(cursor.x, cursor.y);
	context.scale(1 / scale, 1 / scale);
	context.translate(-cursor.x, -cursor.y);
	context.beginPath();

	context.font = '25px Arial';
	const width = context.measureText(cursor.label);

	context.fillStyle = cursor.color;
	context.fillRect(cursor.x + 15, cursor.y + 35, width.width + 10, 35);
	context.fillStyle = 'black';
	context.fillText(cursor.label, cursor.x + 20, cursor.y + 60);

	context.translate(cursor.x, cursor.y);
	context.scale(scale, scale);
	context.translate(-cursor.x, -cursor.y);
}
