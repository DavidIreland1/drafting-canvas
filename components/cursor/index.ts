import Select from './select';
import Move from './move';
import Resize from './resize';
import Rotate from './rotate';
import None from './none';

const Cursors = {
	select: Select,
	move: Select,
	resize: Resize,
	rotate: Rotate,
	none: None,
};

export default class Cursor {
	static draw(cursor, context, view) {
		Cursors[cursor.type].draw(cursor, context, view);
	}
}
