import Select from './select';
import Move from './move';
import Stretch from './stretch';
import Resize from './resize';
import Rotate from './rotate';
import None from './none';

const Cursors = {
	select: Select,
	move: Select,
	stretch: Stretch,
	resize: Resize,
	rotate: Rotate,
	none: None,
};

export default class Cursor {
	static draw(cursor, context, view) {
		context.canvas.style.cursor = 'none';
		Cursors[cursor.type].draw(cursor, context, view);
	}
}
