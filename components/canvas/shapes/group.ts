import { collide, draw, bound } from './shapes';

export function drawGroup(group, context) {
	group.elements.forEach((element) => {
		draw(element, context);
	});
}

export function outlineGroup(group, context, view) {
	context.strokeStyle = 'blue';
	context.lineWidth = 2 / view.scale;
	const bounds = boundGroup(group);
	context.beginPath();
	context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
	context.stroke();
}

export function highlightGroup(group, context, view) {
	context.strokeStyle = 'blue';
	context.lineWidth = 1 / view.scale;
	const bounds = boundGroup(group);
	context.beginPath();
	context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
	context.stroke();
}

export function boundGroup(group) {
	const positions = group.elements.map((element) => bound(element));

	const min_x = positions.reduce((x, position) => Math.min(x, position.x), Number.MAX_SAFE_INTEGER);
	const min_y = positions.reduce((y, position) => Math.min(y, position.y), Number.MAX_SAFE_INTEGER);
	return {
		x: min_x,
		y: min_y,
		width: positions.reduce((x, position) => Math.max(x, position.x + position.width), Number.MIN_SAFE_INTEGER) - min_x,
		height: positions.reduce((y, position) => Math.max(y, position.y + position.height), Number.MIN_SAFE_INTEGER) - min_y,
	};
}

export function moveGroup(group, delta_x: number, delta_y: number) {
	group.elements.forEach((element) => {
		element.move(delta_x, delta_y);
	});
}

export function collideGroup(group, position: { x: number; y: number }): boolean {
	const target = group.elements.find((element) => collide(element, position));
	return target ? true : false;
}
