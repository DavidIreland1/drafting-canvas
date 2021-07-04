import { drawCircle } from './elements/circle';

export function draw(context, element) {
	// context.fillStyle = element.style;
	// context.strokeStyle = element.style;
	// context.lineWidth = element.line_width;

	switch (element.type) {
		case 'circle':
			drawCircle(context, element);
			break;
		case 'group':
			element.children.forEach((child) => {
				draw(context, child);
			});
			break;
	}
}
