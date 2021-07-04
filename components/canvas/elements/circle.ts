export function drawCircle(context, element) {
	context.beginPath();
	context.fillStyle = element.color;
	context.arc(element.x, element.y, element.radius, element.start_angle, element.end_angle);
	context.fill();
}

export function collideCircle(position, element) {
	return (element.x - position.x) ** 2 + (element.y - position.y) ** 2 < element.radius ** 2;
}
