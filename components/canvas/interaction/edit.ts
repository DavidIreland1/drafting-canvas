import Settings from '../../settings';
import Elements from '../elements/elements';
import actions from '../../../redux/slice';
import { roundPoint } from './round-point';
import { DOMToCanvas, split } from '../../../utils/utils';

export default function edit(canvas, store, view, target, last_position, down_event, point) {
	const { user } = Settings;
	const move = (move_event) => {
		let position = DOMToCanvas(move_event, canvas, view);

		const state = store.getState().present;
		let [, points] = split(state.elements, (element) => element.selected).map((elements) => elements.map((element) => Elements[element.type].points(element)).flat());

		position = roundPoint(position, [] /*selected_points*/, points, view);

		const selected_ids = state.elements.filter((element) => element.editing).map((element) => element.id);

		store.dispatch(actions.edit({ user_id: user.id, id: target.id, position, last_position, selected_ids, point }));

		last_position = position;
	};
	window.addEventListener('mousemove', move);

	const release = () => window.removeEventListener('mousemove', move);
	window.addEventListener('mouseup', release, { once: true });
}
