export function drawCircle(circle, context) {
	context.fillStyle = circle.color;
	context.beginPath();
	context.arc(circle.x, circle.y, circle.radius, circle.start_angle, circle.end_angle, circle.counter_clockwise);
	context.fill();
}

export function outlineCircle(circle, context, view) {
	context.strokeStyle = 'blue';
	context.lineWidth = 2 / view.scale;
	context.beginPath();
	context.arc(circle.x, circle.y, circle.radius, circle.start_angle, circle.end_angle);
	context.stroke();
}

export function highlightCircle(circle, context, view) {
	context.strokeStyle = 'blue';
	context.lineWidth = 1 / view.scale;
	context.beginPath();
	context.arc(circle.x, circle.y, circle.radius, circle.start_angle, circle.end_angle);
	context.stroke();
	const bounds = boundCircle(circle);
	context.beginPath();
	context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
	context.stroke();
}

export function collideCircle(circle, position) {
	return (circle.x - position.x) ** 2 + (circle.y - position.y) ** 2 < circle.radius ** 2;
}

export function boundCircle(circle): { x: number; y: number; width: number; height: number } {
	return {
		x: circle.x - circle.radius,
		y: circle.y - circle.radius,
		width: circle.radius * 2,
		height: circle.radius * 2,
	};
}
