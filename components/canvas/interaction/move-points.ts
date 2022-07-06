import Settings from '../../settings';
import Elements from '../elements/elements';
import actions from '../../../redux/slice';
import { roundPoint } from './round-point';
import { DOMToCanvas, split } from '../../../utils/utils';
import { View } from '../../../types/user-types';

export default function movePoints(canvas, store, view: View, target, last_position, down_event, point) {
	const { user } = Settings;
	const move = (move_event) => {
		let position = DOMToCanvas(move_event, canvas, view);

		const state = store.getState().present;
		const [, points] = split(state.elements, (element) => element.selected).map((elements) => elements.map((element) => Elements[element.type].points(element)).flat());

		position = roundPoint(position, [position], points, view);

		const editing = state.elements.filter((element) => element.editing);
		const editing_ids = editing.map((element) => element.id);

		const selected_points = editing
			.map((element) => Elements[element.type].getPoints(element))
			.flat()
			.filter((point) => point.selected);

		const point_ids = selected_points.map((point) => point.id);
		const control_indexes = selected_points.map((point) => [point.selected ? true : false, ...point.controls.map((control) => control.selected)]);

		store.dispatch(actions.movePoints({ user_id: user.id, id: target.id, position, last_position, editing_ids, point_ids, control_indexes }));

		last_position = position;
	};
	window.addEventListener('mousemove', move);

	const release = () => window.removeEventListener('mousemove', move);
	window.addEventListener('mouseup', release, { once: true });
}
