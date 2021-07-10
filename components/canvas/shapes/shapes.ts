import { boundCircle, collideCircle, drawCircle, highlightCircle, outlineCircle } from './circle';
import { boundEllipse, collideEllipse, drawEllipse, highlightEllipse, outlineEllipse, collideEditEllipse, resizeEllipse } from './ellipse';
import { boundGroup, collideGroup, drawGroup, highlightGroup, outlineGroup } from './group';

export function draw(element, context) {
	switch (element.type) {
		case 'ellipse':
			return drawEllipse(element, context);
		case 'circle':
			return drawCircle(element, context);
		case 'group':
			return drawGroup(element, context);
	}
}

export function collide(element, position) {
	switch (element.type) {
		case 'ellipse':
			return collideEllipse(element, position);
		case 'circle':
			return collideCircle(element, position);
		case 'group':
			return collideGroup(element, position);
	}
}
export function collideEdit(element, position, view) {
	switch (element.type) {
		case 'ellipse':
			return collideEditEllipse(element, position, view);
		// case 'circle':
		// 	return collideEditCircle(element, position);
		// case 'group':
		// 	return collideEditGroup(element, position);
	}
}

export function highlight(element, context, view) {
	switch (element.type) {
		case 'ellipse':
			return highlightEllipse(element, context, view);
		case 'circle':
			return highlightCircle(element, context, view);
		case 'group':
			return highlightGroup(element, context, view);
	}
}

export function outline(element, context, view) {
	switch (element.type) {
		case 'ellipse':
			return outlineEllipse(element, context, view);
		case 'circle':
			return outlineCircle(element, context, view);
		case 'group':
			return outlineGroup(element, context, view);
	}
}

export function bound(element) {
	switch (element.type) {
		case 'ellipse':
			return boundEllipse(element);
		case 'circle':
			return boundCircle(element);
		case 'group':
			return boundGroup(element);
	}
}

export function move(element, position, last_position) {
	switch (element.type) {
		case 'group':
			return element.elements.forEach((child) => {
				move(child, position, last_position);
			});
		default:
			element.x += position.x - last_position.x;
			element.y += position.y - last_position.y;
	}
}

export function resize(element, position, last_position) {
	switch (element.type) {
		case 'ellipse':
			return resizeEllipse(element, position, last_position);
		// case 'circle':
		// 	return resizeCircle(element, delta_x, delta_y);
		// case 'group':
		// 	return resizeGroup(element, delta_x, delta_y);
	}
}
