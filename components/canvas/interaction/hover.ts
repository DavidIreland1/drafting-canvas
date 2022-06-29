import { DOMToCanvas } from '../../../utils/utils';
import Elements from '../../canvas/elements/elements';
import Settings from '../../settings';
import actions from '../../../redux/slice';

export default function hover(event: MouseEvent, canvas, store, id, active) {
	const view = store.getState().present.views.find((view) => view.id === id);
	const cursor = store.getState().present.cursors.find((view) => view.id === id);

	if (!view) return;
	const position = DOMToCanvas(event, canvas, view);

	if (cursor.mode === 'create') return store.dispatch(actions.cursor({ user_id: Settings.user.id, ...position }));

	const target = active.altering[0]?.element;
	const action = active.altering[0]?.action ?? (event.buttons ? undefined : 'select');

	const rotation = cursorRotation(target, position, cursor);

	store.dispatch(actions.cursor({ user_id: Settings.user.id, ...position, rotation, type: cursor.pressed ? cursor.type : action, visible: true }));
	store.dispatch(actions.hoverOnly({ id: active.hovering[0]?.id }));
}

function cursorRotation(target, position, cursor) {
	if (!target) return cursor.rotation;
	if (cursor.type === 'stretchX') return target.rotation;
	if (cursor.type === 'stretchY') return target.rotation - Math.PI / 2;
	if (cursor.type === 'resize' || cursor.type === 'rotate') {
		const center = Elements[target.type].center(target);
		return Math.atan2(center.y - position.y, center.x - position.x);
	}
	return cursor.rotation;
}
