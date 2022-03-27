import Elements from './../elements/elements';
import { boundScreen } from './draw';

export default function drawScrollBars(context: CanvasRenderingContext2D, elements, user_view) {
	const bounds = elements.map((element) => Elements[element.type].positiveBound(element));

	const x = {
		min: Math.min(...bounds.map((bound) => bound.x)),
		max: Math.max(...bounds.map((bound) => bound.x + bound.width)),
	};
	const y = {
		min: Math.min(...bounds.map((bound) => bound.y)),
		max: Math.max(...bounds.map((bound) => bound.y + bound.height)),
	};

	const screen = boundScreen(context, user_view);

	const bar = {
		width: 12,
		padding: 8,
	};
	const end_space = 40;
	const speed = Math.sqrt(user_view.scale);
	const min_length = 100;

	context.beginPath();
	drawYBar(context, screen, y, bar, end_space, speed, min_length);
	drawXBar(context, screen, x, bar, end_space, speed, min_length);
	context.closePath();
	context.fillStyle = '#4448';
	context.strokeStyle = '#4448';
	context.lineWidth = 0;
	context.stroke();
	context.fill();
}

function drawYBar(context, screen, y, bar, end_space, speed, min_length) {
	const x = context.canvas.width - (bar.width + bar.padding);

	const start_hidden = Math.max(screen.y1 - y.min, 0);
	const end_hidden = Math.min(screen.y2 - y.max, 0);

	if (start_hidden === 0 && end_hidden === 0) return;

	const start_y = Math.min(start_hidden * speed + end_space, context.canvas.height - min_length);
	const end_y = Math.max(context.canvas.height + end_hidden * speed - start_y, min_length) - end_space;

	context.arc(x + bar.width / 2, start_y, bar.width / 2, 0, 2 * Math.PI);
	context.rect(x, start_y, bar.width, end_y);
	context.arc(x + bar.width / 2, start_y + end_y, bar.width / 2, 0, 2 * Math.PI);
}

function drawXBar(context, screen, x, bar, end_space, speed, min_length) {
	const y = context.canvas.height - (bar.width + bar.padding);

	const start_hidden = Math.max(screen.x1 - x.min, 0);
	const end_hidden = Math.min(screen.x2 - x.max, 0);
	if (start_hidden === 0 && end_hidden === 0) return;

	const start_x = Math.min(start_hidden * speed + end_space, context.canvas.width - min_length);
	const end_x = Math.max(context.canvas.width + end_hidden * speed - start_x, min_length) - end_space;

	context.moveTo(start_x, y + bar.width / 2);
	context.arc(start_x, y + bar.width / 2, bar.width / 2, 0, 2 * Math.PI);
	context.rect(start_x, y, end_x, bar.width);
	context.arc(start_x + end_x, y + bar.width / 2, bar.width / 2, 0, 2 * Math.PI);
}
