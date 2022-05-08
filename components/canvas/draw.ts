import Elements, { flatten } from './elements/elements';
import Cursor from '../cursor/cursor';
import Grid from './grid';
import crosses from './crosses';
import Settings from './../settings';
import Colors from './../properties/colors';
import scrollBars from './scroll-bars';
import { screenBounds, transformPoint } from '../../utils/utils';
import Group from './elements/group';

const { line_width, box_size, highlight } = Settings;

export default function draw(context: CanvasRenderingContext2D, state, active, user_id) {
	const user_view = state.views.find((view) => view.id === user_id);
	const user_cursor = state.cursors.find((cursor) => cursor.id === user_id);
	if (!user_view || !user_cursor) return active;

	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	if (state.page.visible) {
		context.fillStyle = Colors.toString(state.page.color);
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	}

	context.translate(user_view.x, user_view.y);
	context.scale(user_view.scale, user_view.scale);

	const screen = screenBounds(context, user_view);

	const on_screen = state.elements.filter((element) => element.visible).filter((element) => Elements[element.type].onScreen(element, screen));

	const line = line_width / user_view.scale;
	const box = box_size / user_view.scale;
	const cursor = transformPoint(user_cursor, context.getTransform());

	active.selected = flatten(on_screen).filter((element) => element.selected);
	active.editing = active.selected.filter((element) => element.editing);

	// Draw all onscreen elements and filter for hovering
	if (active.editing.length === 0) {
		active.hovering = on_screen
			.reverse()
			.filter((element) => Elements[element.type].draw(element, context, cursor, user_view))
			.filter((element) => !element.locked)
			.sort((element1) => (element1.selected ? 1 : -1))
			.reverse();
	} else {
		active.hovering = on_screen.reverse().filter((element) => Elements[element.type].draw(element, context, cursor, user_view) && element.editing);
	}
	// Outline hovering
	// if (!user_cursor.pressed)
	flatten(on_screen)
		.filter((element) => element.hover && !element.selected)
		.forEach((element) => Elements[element.type].outline(element, context, highlight, line * 2));

	if (active.editing.length > 0) {
		// Outline editing
		active.editing.forEach((element) => Elements[element.type].outline(element, context, highlight, line));
		// Draw points on editing elements
		active.altering = active.editing.map((element) => Elements[element.type].drawPoints(element, context, cursor, highlight, line, box)).filter((element) => element);
	} else if (!user_cursor.pressed || user_cursor.type !== 'select' /*&& document.activeElement === context.canvas*/) {
		// Draw highlight on selected elements
		if (user_cursor.pressed) {
			if (active.selected.length === 1) {
				active.selected.forEach((element) => Elements[element.type].highlight(element, context, cursor, highlight, line, box));
			} else {
				Group.highlight({ elements: active.selected, type: 'group', rotation: 0 }, context, cursor, highlight, line, box);
			}
		} else {
			if (active.selected.length === 1) {
				active.altering = active.selected.map((element) => Elements[element.type].highlight(element, context, cursor, highlight, line, box)).filter((element) => element);
			} else {
				active.altering = [Group.highlight({ elements: active.selected, type: 'group', rotation: 0 }, context, cursor, highlight, line, box)].filter((element) => element);
			}
		}
	}

	// Can only hover selected elements if about to alter
	if (active.altering.length) active.hovering = active.hovering.filter((element) => element.selected);

	if (user_cursor.pressed) crosses(context, on_screen, active.selected, user_view);

	state.cursors
		.filter((cursor) => cursor.visible)
		.sort((cursor) => (cursor.id !== user_id ? -1 : 1))
		.forEach((cursor) => Cursor.draw(cursor, context, user_view));

	context.resetTransform();
	scrollBars(context, state.elements, user_view);

	if (Settings.grid_enabled) Grid.draw(context, user_view);

	return active;
}
