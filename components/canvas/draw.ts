import Elements, { flatten } from './../elements/elements';
import Cursor from '../cursor/cursor';
import Grid from './grid';
import drawPoints from './points';
import Settings from './../settings';
import Colors from './../properties/colors';
import drawScrollBars from './scroll-bars';

const { line_width, box_size, highlight } = Settings;

export default function draw(context: CanvasRenderingContext2D, state, active, user_id) {
	console.log(active.editing);
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

	const screen = boundScreen(context, user_view);

	const on_screen = flatten(state.elements.filter((element) => element.visible).filter((element) => Elements[element.type].onScreen(element, screen)));

	const line = line_width / user_view.scale;
	const box = box_size / user_view.scale;
	const cursor = transformPoint(user_cursor, context.getTransform());

	active.selected = on_screen.filter((element) => element.selected);
	active.editing = active.selected.filter((element) => element.editing);

	active.hovering = active.selected
		.filter((element) => Elements[element.type].insideBound(element, context, cursor))
		.concat(
			[...on_screen]
				.reverse()
				.filter((element) => Elements[element.type].draw(element, context, cursor, user_view))
				.reverse()
		)
		.filter((element) => !element.locked)
		.sort((element1) => (element1.selected ? -1 : 1));

	// Outline hovering
	if (!user_cursor.pressed) on_screen.filter((element) => element.hover && !element.selected).forEach((element) => Elements[element.type].outline(element, context, highlight, line * 2));

	// active.hovering.slice(0, 1).forEach((element) => (element.selected ? undefined : Elements[element.type].outline(element, context, highlight, line * 2)));
	if (!user_cursor.pressed || user_cursor.type !== 'select') active.altering = active.selected.map((element) => Elements[element.type].highlight(element, context, cursor, highlight, line, box)).filter((element) => element);

	if (user_cursor.pressed) drawPoints(context, on_screen, active.selected, user_view);

	state.cursors
		.filter((cursor) => cursor.visible)
		.sort((cursor) => (cursor.id !== user_id ? -1 : 1))
		.forEach((cursor) => Cursor.draw(cursor, context, user_view));

	context.resetTransform();
	drawScrollBars(context, state.elements, user_view);

	if (Settings.grid_enabled) Grid.draw(context, user_view);

	return active;
}

function transformPoint(point, transform) {
	return {
		x: transform.a * point.x + transform.c * point.y + transform.e,
		y: transform.b * point.x + transform.d * point.y + transform.f,
	};
}

export function boundScreen(context, view) {
	return {
		x1: -view.x / view.scale,
		y1: -view.y / view.scale,
		x2: -view.x / view.scale + context.canvas.width / view.scale,
		y2: -view.y / view.scale + context.canvas.height / view.scale,
	};
}
