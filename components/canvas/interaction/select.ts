import actions from '../../../redux/slice';

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
		store.dispatch(actions.unselectAll());
	}
}
