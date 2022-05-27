import Ellipse from './ellipse';
import Group from './group';
import Rectangle from './rectangle';
import Frame from './frame';
import Line from './line';
import Arrow from './arrow';
import Text from './text';
import Element from './element';

const Elements: { [key: string]: typeof Element } = {
	ellipse: Ellipse,
	group: Group,
	rectangle: Rectangle,
	frame: Frame,
	line: Line,
	arrow: Arrow,
	text: Text,
};

export default Elements;

export function flatten(elements) {
	return elements.reduce((all, element) => all.concat(element.type === 'group' || element.type === 'frame' ? flatten(element.elements) : [], [element]), []);
}

export function forEachElement(elements, callback) {
	elements.forEach((element, index, array) => {
		callback(element, index, array);
		if (element.type === 'group' || element.type === 'frame') {
			forEachElement(element.elements, callback);
		}
	});
}

export function selected(elements, selected_ids) {
	return flatten(elements).filter((element) => selected_ids.includes(element.id));
}
