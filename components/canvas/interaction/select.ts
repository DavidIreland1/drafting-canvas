import actions from '../../../redux/slice';

export default function select(store, active, down_event) {
	// if (active.altering.length > 0) {
	// 	store.dispatch(actions.select({ id: active.hovering[0].id }));
	// } else

	console.log(active.hovering);

	if (active.hovering.length > 0) {
		if (down_event.shiftKey) {
			store.dispatch(actions.select({ id: active.hovering[0].id }));
		} else {
			store.dispatch(actions.selectOnly({ select: [active.hovering[0].id] }));
		}
	} else if (active.altering.length === 0 && down_event.shiftKey === false) {
		store.dispatch(actions.unselectAll());
	}
}
