export function drawEllipse(ellipse, context: CanvasRenderingContext2D) {
	context.fillStyle = ellipse.color;
	context.beginPath();
	context.ellipse(ellipse.x, ellipse.y, ellipse.radius_x, ellipse.radius_y, ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
	context.fill();
}

export function outlineEllipse(ellipse, context, view) {
	context.strokeStyle = 'blue';
	context.lineWidth = 2 / view.scale;
	context.beginPath();
	context.ellipse(ellipse.x, ellipse.y, ellipse.radius_x, ellipse.radius_y, ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
	context.stroke();
}

export function highlightEllipse(ellipse, context, view) {
	context.strokeStyle = 'blue';
	context.lineWidth = 1 / view.scale;
	context.beginPath();
	context.ellipse(ellipse.x, ellipse.y, ellipse.radius_x, ellipse.radius_y, ellipse.rotation, ellipse.start_angle, ellipse.end_angle, ellipse.counter_clockwise);
	context.stroke();
	const bounds = boundEllipse(ellipse);
	context.beginPath();
	context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
	context.stroke();

	const size = 8 / view.scale;
	const line = 1 / view.scale;
	boxes(bounds, size, line).forEach((square) => {
		drawSquare(square, context);
	});
}

function boxes(bounds, size, line) {
	return [
		{
			x: bounds.x - size,
			y: bounds.y - size,
			width: size * 2,
			height: size * 2,
			color: 'white',
			border: {
				color: 'blue',
				width: line,
			},
		},
		{
			x: bounds.x + bounds.width - size,
			y: bounds.y - size,
			width: size * 2,
			height: size * 2,
			color: 'white',
			border: {
				color: 'blue',
				width: line,
			},
		},
		{
			x: bounds.x - size,
			y: bounds.y + bounds.height - size,
			width: size * 2,
			height: size * 2,
			color: 'white',
			border: {
				color: 'blue',
				width: line,
			},
		},
		{
			x: bounds.x + bounds.width - size,
			y: bounds.y + bounds.height - size,
			width: size * 2,
			height: size * 2,
			color: 'white',
			border: {
				color: 'blue',
				width: line,
			},
		},
	];
}

function drawSquare(square, context) {
	context.fillStyle = square.color;
	context.beginPath();
	context.rect(square.x, square.y, square.width, square.height);
	context.fill();

	if (square.border) {
		context.strokeStyle = square.border.color;
		context.lineWisth = square.border.width;
		context.stroke();
	}
}

export function collideEllipse(ellipse, position) {
	return (ellipse.x - position.x) ** 2 / ellipse.radius_x ** 2 + (ellipse.y - position.y) ** 2 / ellipse.radius_y ** 2 < 1;
}

export function boundEllipse(ellipse): { x: number; y: number; width: number; height: number } {
	return {
		x: ellipse.x - ellipse.radius_x,
		y: ellipse.y - ellipse.radius_y,
		width: ellipse.radius_x * 2,
		height: ellipse.radius_y * 2,
	};
}

export function collideEditEllipse(ellipse, position, view) {
	const bounds = boundEllipse(ellipse);
	const size = 8 / view.scale;
	const line = 1 / view.scale;

	return boxes(bounds, size, line).find((box) => collideBox(box, position));
}

function collideBox(box, position) {
	return box.x < position.x && position.x < box.x + box.width && box.y < position.y && position.y < box.y + box.width;
}

export function resizeEllipse(ellipse, position, last_position) {
	const delta_x = (position.x - last_position.x) / 2;
	const delta_y = (position.y - last_position.y) / 2;

	ellipse.x += delta_x;
	ellipse.y += delta_y;

	const x_direction = Math.sign(last_position.x + delta_x - ellipse.x);
	const y_direction = Math.sign(last_position.y + delta_y - ellipse.y);

	ellipse.radius_x += x_direction * delta_x;
	ellipse.radius_y += y_direction * delta_y;

	ellipse.radius_x = Math.abs(ellipse.radius_x);
	ellipse.radius_y = Math.abs(ellipse.radius_y);

	console.log(ellipse.radius_x, ellipse.radius_y);
}
