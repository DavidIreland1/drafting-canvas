import Elements from './elements/elements';
import { View } from './../../types/user-types';
import Settings from '../settings';

export default function crosses(context, elements, selected, view: View) {
	context.beginPath();

	const selected_points = selected.map((element) => Elements[element.type].points(element)).flat();

	const size = 3 / view.scale;
	context.strokeStyle = Settings.cross.color;
	context.lineWidth = 1 / view.scale;

	elements
		.filter((element) => !element.selected)
		.map((element) => Elements[element.type].points(element))
		.flat()
		.forEach((point) => {
			selected_points.forEach((selected_point) => {
				if (Math.round(point.x) === Math.round(selected_point.x) || Math.round(point.y) === Math.round(selected_point.y)) {
					drawCrossPair(context, point, selected_point, size);
				}
			});
		});
	context.stroke();
}

function drawCrossPair(context, point1, point2, size) {
	drawCross(context, point1, size);
	context.moveTo(point1.x, point1.y);
	context.lineTo(point2.x, point2.y);
	drawCross(context, point2, size);
}

function drawCross(context, point, size) {
	context.moveTo(point.x - size, point.y - size);
	context.lineTo(point.x + size, point.y + size);
	context.moveTo(point.x - size, point.y + size);
	context.lineTo(point.x + size, point.y - size);
}
