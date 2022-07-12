import actions from '../../../redux/slice';
import Elements from '../elements/elements';

export default function select(store, active, down_event) {
	if (active.altering.length > 0 && active.altering[0].action === 'movePoints') {
		if (down_event.shiftKey) {
			store.dispatch(actions.selectPoint({ id: active.altering[0].element.id, point_id: active.altering[0].point.id, control_index: active.altering[0].point.control_index }));
		} else {
			store.dispatch(actions.selectPointOnly({ id: active.altering[0].element.id, point_id: active.altering[0].point.id, control_index: active.altering[0].point.control_index }));
		}
	} else if (active.hovering.length > 0) {
		if (active.hovering[0].selected && active.selected.length > 1) {
			return;
		} else if (down_event.shiftKey) {
			store.dispatch(actions.select({ id: active.hovering[0].id }));
		} else {
			store.dispatch(actions.selectOnly({ id: active.hovering[0].id }));
		}
	} else if (active.altering.length === 0 && down_event.shiftKey === false) {
		const selected_points = store
			.getState()
			.present.elements.filter((element) => element.editing)
			.map((element) => Elements[element.type].getPoints(element))
			.flat()
			.filter((point) => point.selected || point.controls.find((control) => control.selected));

		if (selected_points.length) {
			store.dispatch(actions.unselectAllPoints());
		} else {
			store.dispatch(actions.unselectAll());
		}
	}
}
