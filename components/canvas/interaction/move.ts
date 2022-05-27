import Settings from '../../settings';
import Elements from '../elements/elements';
import actions from '../../../redux/slice';
import { roundPoint } from './round-point';
import { DOMToCanvas, split } from '../../../utils/utils';

export default function move(canvas, store, view, target, last_position, down_event) {
	const move = (move_event) => {
		let position = DOMToCanvas(move_event, canvas, view);

		const state = store.getState().present;
		let [, points] = split(state.elements, (element) => element.selected).map((elements) => elements.map((element) => Elements[element.type].points(element)).flat());

		position = roundPoint(position, [] /*selected_points*/, points, view);

		const selected_ids = state.elements.filter((element) => element.selected).map((element) => element.id);

		store.dispatch(actions.move({ user_id: Settings.user.id, id: target.id, position, last_position, selected_ids }));

		last_position = position;
	};
	window.addEventListener('mousemove', move);

	const release = () => window.removeEventListener('mousemove', move);
	window.addEventListener('mouseup', release, { once: true });
}
