import Elements, { flatten } from './elements/elements';
import Cursor from '../cursor/cursor';
import Grid from './grid';
import crosses from './crosses';
import Settings from './../settings';
import Colors from './../properties/colors';
import scrollBars from './scroll-bars';
import { screenBounds, transformPoint } from '../../utils/utils';
import Group from './elements/group';

const { line, box, highlight, grid } = Settings;

export default function draw(context: CanvasRenderingContext2D, state, active, user_id) {
	// const active = { editing: [], hovering: [], selected: [], altering: [] };
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

	const line_width = line.width / user_view.scale;
	const box_size = box.size / user_view.scale;
	const cursor = transformPoint(user_cursor, context.getTransform());

	active.selected = flatten(on_screen).filter((element) => element.selected);
	active.editing = active.selected.filter((element) => element.editing);

	// Draw all onscreen elements and filter for hovering
	if (active.editing.length === 0) {
		active.hovering = on_screen
			.reverse()
			.map((element) => Elements[element.type].draw(element, context, cursor, user_view))
			.filter((element) => element && !element.locked)
			.reverse()
			.sort((element1) => (element1.selected ? -1 : 1));
	} else {
		active.hovering = on_screen
			.reverse()
			.map((element) => Elements[element.type].draw(element, context, cursor, user_view))
			.filter((element) => element && element.editing);
	}

	flatten(on_screen)
		.filter((element) => element.hover && !element.selected)
		.forEach((element) => Elements[element.type].outline(element, context, highlight, line_width * 2));

	if (active.editing.length > 0) {
		// Outline editing
		active.editing.forEach((element) => Elements[element.type].outline(element, context, highlight, line_width));
		// Draw points on editing elements
		active.altering = active.editing.map((element) => Elements[element.type].drawPoints(element, context, cursor, highlight, line_width, box_size, box.color)).filter((element) => element);
	} else if (!user_cursor.pressed || user_cursor.type !== 'select') {
		// Draw highlight on selected elements

		const altering = highlightSelected(active, context, cursor, highlight, line_width, box_size, box.color);
		if (!user_cursor.pressed) active.altering = altering.filter((element) => element);
	}

	// When altering you can only hover already selected elements
	if (active.altering.length) active.hovering = active.hovering.filter((element) => element.selected);

	if (user_cursor.pressed) crosses(context, on_screen, active.selected, user_view);

	state.cursors
		.filter((cursor) => cursor.visible)
		.sort((cursor) => (cursor.id !== user_id ? -1 : 1))
		.forEach((cursor) => Cursor.draw(cursor, context, user_view));

	context.resetTransform();
	scrollBars(context, state.elements, user_view);

	if (grid.enabled) Grid.draw(context, user_view);

	return active;
}

function highlightSelected(active, context, cursor, highlight, line_width, box_size, box_color) {
	if (active.selected.length === 1) return active.selected.map((element) => Elements[element.type].highlight(element, context, cursor, highlight, line_width, box_size, box_color));
	if (active.selected.length > 1) return [Group.highlight({ elements: active.selected, type: 'group', rotation: 0 }, context, cursor, highlight, line_width, box_size, box_color)];
	return [];
}
