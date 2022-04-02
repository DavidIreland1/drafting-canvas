export default function select(store, actions, active, down_event) {
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
