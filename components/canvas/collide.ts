import { collideCircle } from './elements/circle';

export function collide(position, element) {
	switch (element.type) {
		case 'circle':
			return collideCircle(position, element);
		case '':
			break;
	}
}
