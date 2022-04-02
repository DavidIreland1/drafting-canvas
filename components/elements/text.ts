import Element from './element';
import Colors from './../properties/colors';
import { rotatePoint } from '../../utils/utils';

export default class Text extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			editing: true,
			label: 'Text',
			type: 'text',
			text: '',
			style: 'normal',
			weight: 'normal',
			family: 'Arial',
			justify: 'left',
			align: 'start',
			size: 10,
			rotation: 0,
			width: 0,
			height: 0,
			line_height: 1,
			fill: [{ id: id + '123321', type: 'Text', color: [0, 0, 0, 1], format: 'hex4', visible: true }],
		});
	}

	static setFont(element, context: CanvasRenderingContext2D) {
		context.font = `${element.style} normal ${element.weight} ${Math.abs(element.size)}px ${element.family.toLowerCase()}`;
	}

	static fill(element, context: CanvasRenderingContext2D, path) {
		this.setFont(element, context);
		// Splitup text into many lines
		const lines = breakText(element, context);
		const offsets = calculateOffsets(element, context, lines);
		// console.log(lines);
		// console.log(offsets);

		element.fill
			.filter((fill) => fill.visible)
			.forEach((fill) => {
				context.fillStyle = element.text === '' ? 'grey' : Colors.toString(fill.color);
				lines.forEach((line, i) => context.fillText(line, offsets[i].x, offsets[i].y));
			});
	}

	static stroke(element, context: CanvasRenderingContext2D, path: Path2D) {
		this.setFont(element, context);

		// Splitup text into many lines
		const lines = breakText(element, context);
		const offsets = calculateOffsets(element, context, lines);

		element.stroke
			.filter((stroke) => stroke.visible)
			.forEach((stroke) => {
				if (stroke.width === 0) return;

				console.log(stroke.color);
				context.lineWidth = stroke.width;
				context.strokeStyle = Colors.toString(stroke.color);
				// Inside, Center and Outsize
				lines.forEach((line, i) => context.strokeText(line, offsets[i].x, offsets[i].y));
			});
	}

	static effect(element, context: CanvasRenderingContext2D, path: Path2D, before, view) {
		const lines = breakText(element, context);
		const offsets = calculateOffsets(element, context, lines);
		this.setFont(element, context);

		element.effect
			.filter((effect) => effect.visible)
			.forEach((effect) => {
				context.save();
				context.filter = `blur(${Math.round(effect.blur * 0.1 * view.scale)}px)`;
				context.fillStyle = Colors.toString(effect.color);

				context.translate(effect.x, effect.y);
				context.scale(Math.exp(effect.spread * 0.005), Math.exp(effect.spread * 0.005));
				lines.forEach((line, i) => context.fillText(line, offsets[i].x, offsets[i].y));
				context.filter = 'none';
				context.restore();
			});
	}

	static points(text) {
		const center = this.center(text);
		return this._points(text)
			.map((point) => ({
				x: point.x + text.x + text.width / 2,
				y: point.y + text.y + text.height / 2,
			}))
			.map((point) => rotatePoint(point, center, text.rotation))
			.concat(center);
	}

	static _points(text) {
		return [
			{
				x: -text.width / 2,
				y: -text.height / 2,
			},
			{
				x: text.width / 2,
				y: -text.height / 2,
			},
			{
				x: text.width / 2,
				y: text.height / 2,
			},
			{
				x: -text.width / 2,
				y: text.height / 2,
			},
		];
	}

	static path(text) {
		const points = this._points(text);
		const path = new Path2D();
		points.forEach((point) => path.lineTo(point.x, point.y));
		path.closePath();
		return path;
	}

	static draw(text, context: CanvasRenderingContext2D, cursor, view) {
		const center = this.center(text);
		const path = this.path(text);

		context.fillStyle = text.color;

		context.save();
		context.translate(center.x, center.y);
		context.rotate(text.rotation);
		this.effect(text, context, path, true, view);
		this.stroke(text, context, path);
		this.fill(text, context, path);

		const hover = context.isPointInPath(path, cursor.x, cursor.y);

		context.restore();

		return hover;
	}

	static outline(text, context, color, line_width): void {
		const center = this.center(text);

		context.strokeStyle = color;
		context.lineWidth = line_width;
		context.save();
		context.translate(center.x, center.y);
		context.rotate(text.rotation);
		const path = this.path(text);
		context.stroke(path);
		context.restore();
	}

	static bound(text): { x: number; y: number; width: number; height: number } {
		return {
			x: text.x,
			y: text.y,
			width: text.width,
			height: text.height,
		};
	}

	static resize(text, position, last_position): void {
		const center = this.center(text);

		const opposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -text.rotation);
		const new_position = rotatePoint(position, new_center, -text.rotation);

		text.x = new_opposite.x;
		text.y = new_opposite.y;
		text.width = new_position.x - new_opposite.x;
		text.height = new_position.y - new_opposite.y;
	}

	static stretch(text, position, last_position): void {
		const center = this.center(text);

		const opposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (opposite.x + position.x) / 2,
			y: (opposite.y + position.y) / 2,
		};

		const new_opposite = rotatePoint(opposite, new_center, -text.rotation);
		const new_position = rotatePoint(position, new_center, -text.rotation);

		// text.x = new_opposite.x;
		text.y = new_opposite.y;
		// text.width = new_position.x - new_opposite.x;
		text.height = new_position.y - new_opposite.y;
	}
}

function breakText(element, context) {
	// Add placehoder Text...
	if (element.text === '') return ['Text...'];

	// Add space to create extra line for trailing new line character
	const last_line = element.text.endsWith('\n') ? ' ' : '';

	return (
		(element.text + last_line)
			.split('\n')
			// Add line breaks between words where overflowing
			.map((line) =>
				breakLine(
					line.split(' ').map((word, i, words) => ({ value: word, width: context.measureText(word + (i !== words.length - 1 ? ' ' : '')).width })),
					Math.abs(element.width),
					' '
				)
			)
			.flat()
			// Add line breaks between characters where overflowing
			.map((line) =>
				context.measureText(line).width > Math.abs(element.width)
					? breakLine(
							line.split('').map((character) => ({ value: character, width: context.measureText(character).width })),
							Math.abs(element.width),
							''
					  )
					: line
			)
			.flat()
	);
}

function breakLine(words: Array<{ value: string; width: number }>, max_width: number, delim: string): Array<string> {
	let line_width = 0;

	return words.reduce(
		(lines, word) => {
			if (line_width + word.width > max_width && lines[0].length) {
				lines.push('');
				line_width = 0;
			}
			lines[lines.length - 1] += word.value + delim;
			line_width += word.width;
			return lines;
		},
		['']
	);
}

function calculateOffsets(element, context, lines): { x: number; y: number } {
	return lines.map((line, i) => {
		let offset_x;
		if (element.justify === 'left') {
			offset_x = -Math.abs(element.width) / 2;
		} else if (element.justify === 'center') {
			offset_x = -context.measureText(line).width / 2 + 1.4;
		} else if (element.justify === 'right') {
			offset_x = Math.abs(element.width) / 2 - context.measureText(line).width + 3;
		}

		let offset_y;
		if (element.align === 'start') {
			offset_y = -Math.abs(element.height) / 2 + (i + 1) * Math.abs(element.size) * element.line_height - 2;
		} else if (element.align === 'center') {
			offset_y = (i + 1 - lines.length / 2) * Math.abs(element.size) * element.line_height - 2;
		} else if (element.align === 'end') {
			offset_y = Math.abs(element.height) / 2 - element.size / 2 + (i + 1 - lines.length) * Math.abs(element.size) * element.line_height + 3;
		}

		return {
			x: offset_x,
			y: offset_y,
		};
	});
}
