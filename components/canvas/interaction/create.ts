import Settings from '../../settings';
import { DOMToCanvas, generateID } from '../../../utils/utils';
import { roundPoint } from './round-point';
import actions from '../../../redux/slice';
import { View } from '../../../types/user-types';

export default function create(last_position, canvas, store, view: View, cursor, points) {
	const id = generateID();
	let expanded = false;
	const first_position = {
		x: last_position.x,
		y: last_position.y,
	};
	store.dispatch(actions.createElement({ user_id: Settings.user.id, id: id, type: cursor.type, position: last_position }));

	const move = (move_event) => {
		let position = DOMToCanvas(move_event, canvas, view);
		if (Math.abs(first_position.x - position.x) + Math.abs(first_position.x - position.y) > 40) expanded = true;
		position = roundPoint(position, [position], points, view);
		store.dispatch(actions.resize({ user_id: Settings.user.id, id: id, position, last_position, selected_ids: [id] }));
		last_position = position;
	};
	window.addEventListener('mousemove', move);

	const release = () => {
		if (expanded === false) {
			store.dispatch(
				actions.resize({
					user_id: Settings.user.id,
					id: id,
					position: { x: last_position.x + 101, y: last_position.y + 101 },
					last_position,
					selected_ids: [id],
				})
			);
		}
		window.removeEventListener('mousemove', move);
	};

	window.addEventListener('mouseup', release, { once: true });
}
