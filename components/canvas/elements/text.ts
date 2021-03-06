import Element from './element';
import Colors from './../../properties/colors';
import { View } from '../../../types/user-types';

export default class Text extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			editing: true, //true
			label: 'Text',
			type: 'text',
			text: '',
			style: 'normal',
			weight: 'normal',
			family: 'Arial',
			justify: 'left',
			align: 'start',
			size: 20,
			rotation: 0,
			line_height: 1,
			fill: [{ id: id + '123321', type: 'Text', color: [0, 0, 0, 1], format: 'hex4', visible: true }],
		});
	}

	static setFont(element, context: CanvasRenderingContext2D) {
		context.font = `${element.style} normal ${element.weight} ${Math.abs(element.size)}px ${element.family.toLowerCase()}`;
	}

	static fill(element, context: CanvasRenderingContext2D, path) {
		const bounds = this.bound(element);
		this.setFont(element, context);
		// Split up text into many lines
		const lines = breakText(element, context, bounds.width);
		const offsets = calculateOffsets(element, context, bounds.width, bounds.height, lines);

		element.fill
			.filter((fill) => fill.visible)
			.forEach((fill) => {
				context.fillStyle = element.text === '' ? 'grey' : Colors.toString(fill.color);
				lines.forEach((line, i) => context.fillText(line, offsets[i].x, offsets[i].y));
			});
	}

	static stroke(element, context: CanvasRenderingContext2D, path: Path2D) {
		const bounds = this.bound(element);
		this.setFont(element, context);

		// Split up text into many lines
		const lines = breakText(element, context, bounds.width);
		const offsets = calculateOffsets(element, context, bounds.width, bounds.height, lines);

		return Math.max(
			...element.stroke
				.filter((stroke) => stroke.visible)
				.map((stroke) => {
					if (stroke.width === 0) return 0;
					context.lineWidth = stroke.width;
					context.strokeStyle = Colors.toString(stroke.color);
					// Inside, Center and Outsize
					lines.forEach((line, i) => context.strokeText(line, offsets[i].x, offsets[i].y));
					return stroke.width;
				})
		);
	}

	static effect(element, context: CanvasRenderingContext2D, path: Path2D, before, view: View) {
		const bounds = this.bound(element);
		const lines = breakText(element, context, bounds.width);
		const offsets = calculateOffsets(element, context, bounds.width, bounds.height, lines);
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

	static draw(text, context: CanvasRenderingContext2D, cursor, view: View) {
		// if (text.editing) return false;
		const center = this.center(text);
		const path = this.path(text);
		context.fillStyle = text.color;
		context.save();
		context.translate(center.x, center.y);
		context.rotate(text.rotation);
		this.effect(text, context, path, true, view);
		this.stroke(text, context, path);
		this.fill(text, context, path);
		context.restore();
		return context.isPointInPath(path, cursor.x, cursor.y) ? text : undefined;
	}

	static drawPoints(element, context, cursor, color, line, box_size) {
		return undefined;
	}
}

function breakText(element, context, width) {
	// Add placeholder Text...
	if (element.text === '') return ['Text...'];

	// Add space to create extra line for trailing new line character
	const last_line = element.text.endsWith('\n') ? ' ' : '';

	return (
		(element.text + last_line)
			.split('\n')
			.map((line) =>
				// Add line breaks between words where overflowing
				breakLine(
					line.split(' ').map((word, i, words) => ({ value: word, width: context.measureText(word + (i !== words.length - 1 ? ' ' : '')).width })),
					Math.abs(width),
					' '
				)
			)
			.flat()
			// Add line breaks between characters where overflowing
			.map((line) =>
				context.measureText(line).width > Math.abs(width)
					? breakLine(
							line.split('').map((character) => ({ value: character, width: context.measureText(character).width })),
							Math.abs(width),
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

function calculateOffsets(element, context, width, height, lines): { x: number; y: number } {
	return lines.map((line, i) => ({
		x: xOffset(element, context, line, width),
		y: yOffset(element, lines, i, height),
	}));
}

function xOffset(element, context, line, width) {
	if (element.justify === 'left') return -Math.abs(width) / 2;
	if (element.justify === 'center') return -context.measureText(line).width / 2 + 1.4;
	if (element.justify === 'right') return Math.abs(width) / 2 - context.measureText(line).width + 3;
}

function yOffset(element, lines, i, height) {
	if (element.align === 'start') return -Math.abs(height) / 2 + (i + 1) * Math.abs(element.size) * element.line_height - 2;
	if (element.align === 'center') return (i + 1 - lines.length / 2) * Math.abs(element.size) * element.line_height - 2;
	if (element.align === 'end') return Math.abs(height) / 2 - element.size / 2 + (i + 1 - lines.length) * Math.abs(element.size) * element.line_height + 3;
}
