import Elements, { flatten } from './../elements/elements';
import Cursor from '../cursor/cursor';
import Grid from './grid';
import drawPoints from './points';
import Settings from './../settings';
import Colors from './../properties/colors';

const { line_width, box_size, highlight } = Settings;

export default function draw(context: CanvasRenderingContext2D, store, actions, active, user_id) {
	const state = store.getState().present;

	const user_view = state.views.find((view) => view.id === user_id);
	const user_cursor = state.cursors.find((cursor) => cursor.id === user_id);
	if (!user_view || !user_cursor) return;

	if (user_view.centered === false) store.dispatch(actions.centerView({ user_id: user_id, x: context.canvas.width / 2, y: context.canvas.height / 2 }));

	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = Colors.toString(state.page.color);
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	context.translate(user_view.x, user_view.y);
	context.scale(user_view.scale, user_view.scale);

	const screen = boundScreen(context, user_view);

	const on_screen = state.elements.filter((element) => element.visible).filter((element) => Elements[element.type].onScreen(element, screen));

	const line = line_width / user_view.scale;
	const box = box_size / user_view.scale;
	const cursor = transformPoint(user_cursor, context.getTransform());

	active.selected = flatten(on_screen).filter((element) => element.selected);

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
	if (!user_cursor.pressed)
		flatten(on_screen)
			.filter((element) => element.hover && !element.selected)
			.forEach((element) => Elements[element.type].outline(element, context, highlight, line * 2));
	// active.hovering.slice(0, 1).forEach((element) => (element.selected ? undefined : Elements[element.type].outline(element, context, highlight, line * 2)));
	if (!user_cursor.pressed || user_cursor.type !== 'select') active.altering = active.selected.map((element) => Elements[element.type].highlight(element, context, cursor, highlight, line, box)).filter((element) => element);

	if (user_cursor.pressed) drawPoints(context, on_screen, active.selected, user_view);

	state.cursors
		.filter((cursor) => cursor.visible)
		.sort((cursor) => (cursor.id !== user_id ? -1 : 1))
		.forEach((cursor) => Cursor.draw(cursor, context, user_view));

	context.resetTransform();
	drawScroll(context, state.elements, user_view);

	if (Settings.grid_enabled) Grid.draw(context, user_view);
}

function transformPoint(point, transform) {
	return {
		x: transform.a * point.x + transform.c * point.y + transform.e,
		y: transform.b * point.x + transform.d * point.y + transform.f,
	};
}

function boundScreen(context, view) {
	return {
		x1: -view.x / view.scale,
		y1: -view.y / view.scale,
		x2: -view.x / view.scale + context.canvas.width / view.scale,
		y2: -view.y / view.scale + context.canvas.height / view.scale,
	};
}

function drawScroll(context: CanvasRenderingContext2D, elements, user_view) {
	const bounds = elements.map((element) => Elements[element.type].positiveBound(element));
	const min_x = Math.min(...bounds.map((bound) => bound.x));
	const max_x = Math.max(...bounds.map((bound) => bound.x + bound.width));
	const min_y = Math.min(...bounds.map((bound) => bound.y));
	const max_y = Math.max(...bounds.map((bound) => bound.y + bound.height));

	const screen = boundScreen(context, user_view);

	const bar_width = 15;
	const side_space = 10;
	const end_space = 40;
	const speed = user_view.scale;
	const min_length = 200;

	context.beginPath();
	drawYBar(context, screen, min_y, max_y, bar_width, side_space, end_space, speed, min_length);
	drawXBar(context, screen, min_x, max_x, bar_width, side_space, end_space, speed, min_length);
	context.closePath();
	context.fillStyle = '#4448';
	context.strokeStyle = '#FFF8';
	context.lineWidth = 2;
	context.stroke();
	context.fill();
}

function drawYBar(context, screen, min_y, max_y, bar_width, side_space, end_space, speed, min_length) {
	const x = context.canvas.width - (bar_width + side_space);

	const start_hidden = Math.max(screen.y1 - min_y, 0);
	const end_hidden = Math.min(screen.y2 - max_y, 0);

	if (start_hidden === 0 && end_hidden === 0) return;

	const start_y = Math.min(start_hidden * speed + end_space, context.canvas.height - min_length);
	const end_y = Math.max(context.canvas.height + end_hidden * speed - start_y, min_length) - end_space;

	context.arc(x + bar_width / 2, start_y, bar_width / 2, 0, 2 * Math.PI);
	context.rect(x, start_y, bar_width, end_y);
	context.arc(x + bar_width / 2, start_y + end_y, bar_width / 2, 0, 2 * Math.PI);
}

function drawXBar(context, screen, min_x, max_x, bar_width, side_space, end_space, speed, min_length) {
	const y = context.canvas.height - (bar_width + side_space);

	const start_hidden = Math.max(screen.x1 - min_x, 0);
	const end_hidden = Math.min(screen.x2 - max_x, 0);
	if (start_hidden === 0 && end_hidden === 0) return;

	const start_x = Math.min(start_hidden * speed + end_space, context.canvas.width - min_length);
	const end_x = Math.max(context.canvas.width + end_hidden * speed - start_x, min_length) - end_space;

	context.moveTo(start_x, y + bar_width / 2);
	context.arc(start_x, y + bar_width / 2, bar_width / 2, 0, 2 * Math.PI);
	context.rect(start_x, y, end_x, bar_width);
	context.arc(start_x + end_x, y + bar_width / 2, bar_width / 2, 0, 2 * Math.PI);
}
