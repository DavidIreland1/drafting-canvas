import Element from './element';
import Colors from './../properties/colors';

export default class Text extends Element {
	static create(id, position, selected) {
		return Object.assign(super.create(id, position, selected), {
			x: position.x,
			y: position.y,
			label: 'Text',
			type: 'text',
			text: 'Hello There\nGeneral Kenoby\nMy Man',
			style: 'normal',
			weight: 'normal',
			family: 'arial',
			justified: 'left',
			align: 'top',
			size: 10,
			rotation: 0,
			width: 0,
			height: 0,
			fill: [{ id: id + '123321', type: 'Text', color: [1, 1, 0, 1], visible: true }],
		});
	}

	static fill(element, context: CanvasRenderingContext2D, path) {
		context.font = `${element.style} normal ${element.weight} ${Math.abs(element.size)}px ${element.family}`;

		// Splitup text into many lines
		const lines = breakText(element, context);
		const offsets = createOffsets(element, context, lines);

		element.fill
			.filter((fill) => fill.visible)
			.forEach((fill) => {
				context.fillStyle = element.text === '' ? 'grey' : Colors.hslaToString(Colors.hsbaToHsla(fill.color));
				lines.forEach((line, i) => context.fillText(line, offsets[i].x, offsets[i].y));
			});
	}

	static stroke(element, context: CanvasRenderingContext2D, path: Path2D) {
		context.font = `${element.style} normal ${element.weight} ${Math.abs(element.size)}px ${element.family}`;

		// Splitup text into many lines
		const lines = breakText(element, context);
		const offsets = createOffsets(element, context, lines);

		element.stroke
			.filter((stroke) => stroke.visible)
			.forEach((stroke) => {
				if (stroke.width === 0) return;
				context.lineWidth = stroke.width;
				context.strokeStyle = Colors.hslaToString(Colors.hsbaToHsla(stroke.color));
				// Inside, Center and Outsize
				lines.forEach((line, i) => context.fillText(line, offsets[i].x, offsets[i].y));
			});
	}

	static effect(element, context: CanvasRenderingContext2D, path: Path2D, before, view) {
		const lines = breakText(element, context);
		const offsets = createOffsets(element, context, lines);

		element.effect
			.filter((effect) => effect.visible)
			.forEach((effect) => {
				context.save();
				// console.log(effect.blur * 0.1 * view.scale);
				context.filter = `blur(${Math.round(effect.blur * 0.1 * view.scale)}px)`;
				context.fillStyle = Colors.hslaToString(Colors.hsbaToHsla(effect.color));

				context.translate(effect.x, effect.y);
				context.scale(Math.exp(effect.spread * 0.005), Math.exp(effect.spread * 0.005));
				context.rotate(element.rotation);
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
			.map((point) => this.rotatePoint(point, center, text.rotation))
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
		this.effect(text, context, path, true, view);
		context.rotate(text.rotation);
		this.fill(text, context, path);
		this.effect(text, context, path, false, view);
		this.stroke(text, context, path);

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

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -text.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -text.rotation);

		text.x = new_oposite.x;
		text.y = new_oposite.y;
		text.width = new_poistion.x - new_oposite.x;
		text.height = new_poistion.y - new_oposite.y;
	}

	static stretch(text, position, last_position): void {
		const center = this.center(text);

		const oposite = {
			x: center.x - (last_position.x - center.x),
			y: center.y - (last_position.y - center.y),
		};

		const new_center = {
			x: (oposite.x + position.x) / 2,
			y: (oposite.y + position.y) / 2,
		};

		const new_oposite = this.rotatePoint(oposite, new_center, -text.rotation);
		const new_poistion = this.rotatePoint(position, new_center, -text.rotation);

		// text.x = new_oposite.x;
		text.y = new_oposite.y;
		// text.width = new_poistion.x - new_oposite.x;
		text.height = new_poistion.y - new_oposite.y;
	}
}

function breakText(element, context) {
	return (
		// Add placehoder Text...
		(element.text === '' ? 'Text...' : element.text)
			.split('\n')
			// Add line breaks between words where overflowing
			.map((line) =>
				breakLine(
					line.split(' ').map((word) => ({ value: word, width: context.measureText(word).width })),
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

function breakLine(words, max_width, delim) {
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

function createOffsets(element, context, lines) {
	return lines.map((line, i) => {
		let offset_x = -Math.abs(element.width) / 2;
		if (element.justified === 'middle') {
			offset_x = -context.measureText(line).width / 2;
		} else if (element.justified === 'right') {
			offset_x = Math.abs(element.width) / 2 - context.measureText(line).width;
		}

		let offset_y = -Math.abs(element.height) / 2 + (i + 1) * Math.abs(element.size);
		if (element.align === 'middle') {
			offset_y = (i + 1 - lines.length / 2) * Math.abs(element.size);
		} else if (element.align === 'bottom') {
			offset_y = Math.abs(element.height) / 2 - element.size / 2 + (i + 1 - lines.length) * Math.abs(element.size);
		}

		return {
			x: offset_x,
			y: offset_y,
		};
	});
}
