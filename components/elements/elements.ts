import Circle from './circle';
import Ellipse from './ellipse';
import Group from './group';
import Rectangle from './rectangle';

export default {
	circle: Circle,
	ellipse: Ellipse,
	group: Group,
	rectangle: Rectangle,
};

export function flatten(elements) {
	return elements.reduce((all, element) => all.concat(element.type === 'group' ? flatten(element.elements) : [], [element]), []);
}

export function forEachElement(elements, callback) {
	elements.forEach((element, index, array) => {
		console.log(element);
		callback(element, index, array);
		if (element.type === 'group') {
			forEachElement(element.elements, callback);
		}
	});
}
