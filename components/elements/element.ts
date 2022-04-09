import { Bound, Position } from '../../types/box-types';
import { Effect, ElementType, Fill, Stroke } from '../../types/element-types';
import Colors from './../properties/colors';

const images = {};
export default class Element {
	static create(id: string, position: Position, selected: boolean): ElementType {
		return {
			id: id,
			editing: false,
			selected: selected,
			hover: false,
			fill: [{ id: id + '2123', type: 'Solid', color: [0, 0, 0.8, 1], format: 'hex4', visible: true }],
			stroke: [],
			effect: [],
			points: [],
			rotation: 0,
			visible: true,
			locked: false,
			x: position.x,
			y: position.y,
		};
	}

	static path(element: ElementType) {
		return new Path2D();
	}

	static fill(element, context: CanvasRenderingContext2D, path) {
		element.fill
			.filter((fill) => fill.visible)
			.forEach((fill) => {
				if (fill.type === 'Solid') {
					context.fillStyle = Colors.toString(fill.color);
					context.fill(path);
				} else if (fill.type === 'Image') {
					context.save();
					context.clip(path);
					if (!images[fill.id]) {
						images[fill.id] = new Image();
						images[fill.id].src = fill.src;
						images[fill.id].onerror = () => (images[fill.id].broken = true);
					} else if (images[fill.id].complete && !images[fill.id].broken) {
						context.drawImage(images[fill.id], fill.x - element.width / 2, fill.y - element.height / 2, element.width, element.height);
						context.restore();
					}
				}
			});
	}

	static stroke(element, context: CanvasRenderingContext2D, path: Path2D) {
		element.stroke
			.filter((stroke) => stroke.visible)
			.forEach((stroke) => {
				if (stroke.width === 0) return;
				context.save();
				context.strokeStyle = Colors.toString(stroke.color);
				context.lineWidth = stroke.width;
				if (stroke.type === 'Inside') {
					context.clip(path);
					context.lineWidth = stroke.width * 2;
				} else if (stroke.type === 'Outside') {
					const clone = new Path2D(path);
					// Fix for negative widths
					if ((element.height > 0 && element.width > 0) || (element.height < 0 && element.width < 0)) {
						clone.rect(10000, -10000, -20000, 20000); // TODO: Need to fix this
					} else {
						clone.rect(-10000, -10000, 20000, 20000); // TODO: Need to fix this
					}
					context.clip(clone);
					context.lineWidth = stroke.width * 2;
				}
				context.stroke(path); // Center
				context.restore();
			});
	}

	static effect(element, context: CanvasRenderingContext2D, path: Path2D, before: boolean, view) {
		element.effect
			.filter((effect) => effect.visible)
			.forEach((effect) => {
				context.save();
				if (effect.type === 'Drop shadow' && before) {
					context.filter = `blur(${effect.blur * 0.2 * view.scale}px)`;
					context.fillStyle = Colors.toString(effect.color);
					context.translate(effect.x, effect.y);
					context.scale(Math.exp(effect.spread * 0.005), Math.exp(effect.spread * 0.005));
					context.rotate(element.rotation);
					context.fill(path);
				} else if (effect.type === 'Inner shadow' && !before) {
					context.filter = `blur(${effect.blur * 0.5 * view.scale}px)`;
					context.fillStyle = Colors.toString(effect.color);
					context.clip(path);
					context.translate(effect.x, effect.y);
					context.scale(Math.exp(-effect.spread * 0.005), Math.exp(-effect.spread * 0.005));
					const clone = new Path2D(path);
					// Fix for negative widths
					if ((element.height > 0 && element.width > 0) || (element.height < 0 && element.width < 0)) {
						clone.rect(10000, -10000, -20000, 20000); // TODO: Need to fix this
					} else {
						clone.rect(-10000, -10000, 20000, 20000); // TODO: Need to fix this
					}
					context.fill(clone);
					context.translate(-effect.x, -effect.y);
				}
				context.filter = 'none';
				context.restore();
			});
	}

	static draw(element, context: CanvasRenderingContext2D, cursor, view): boolean {
		const path = this.path(element);

		this.effect(element, context, path, true, view);
		this.fill(element, context, path);
		this.effect(element, context, path, false, view);

		const fill = element.fill.length && context.isPointInPath(path, cursor.x, cursor.y);

		this.stroke(element, context, path);
		const stroke = element.stroke.length && context.isPointInStroke(path, cursor.x, cursor.y);

		return fill || stroke;
	}

	static resize(element, position, last_position): void {
		return;
	}

	static stretch(element, position, last_position): void {
		return;
	}

	static outline(element, context: CanvasRenderingContext2D, color: string, line: number): void {
		return;
	}

	static onScreen(element, screen) {
		const bounds = this.positiveBound(element);
		return !(bounds.x > screen.x2 || bounds.y > screen.y2 || bounds.x + bounds.width < screen.x1 || bounds.y + bounds.height < screen.y1);
	}

	static highlight(element, context, cursor, highlight, line, box) {
		this.outline(element, context, highlight, line);
		let action = undefined;
		if (this.drawBound(element, context, cursor, highlight, line)) action = 'stretch';
		if (this.drawRotate(element, context, cursor, box)) action = 'rotate';
		if (this.drawResize(element, context, cursor, highlight, line, box)) action = 'resize';
		return action ? { action, element } : undefined;
	}

	// Maybe this can be removed
	static insideBound(element, context: CanvasRenderingContext2D, cursor): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.save();
		context.translate(center.x, center.y);
		context.rotate(element.rotation);
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		context.restore();

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawBound(element, context: CanvasRenderingContext2D, cursor, color: string, line: number): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.save();
		context.translate(center.x, center.y);
		context.rotate(element.rotation);
		context.strokeStyle = color;
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		context.lineWidth = line * 2;
		const hov = context.isPointInStroke(cursor.x, cursor.y);
		context.lineWidth = line;
		context.stroke();
		context.restore();

		return hov;
	}

	static drawResize(element, context: CanvasRenderingContext2D, cursor, color: string, line: number, box_size: number): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.save();
		context.translate(center.x, center.y);
		context.rotate(element.rotation);

		bounds.x = -bounds.width / 2;
		bounds.y = -bounds.height / 2;
		context.fillStyle = 'white';
		context.strokeStyle = color;
		context.lineWidth = line;

		context.beginPath();
		this.boxes(element.id, bounds, box_size).forEach((square) => context.rect(square.x, square.y, square.width, square.height));
		// Check if zoomed in enough
		if (Math.abs(bounds.width) + Math.abs(bounds.height) > box_size * 4) {
			context.fill();
			context.stroke();
		}
		context.restore();

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawRotate(element, context: CanvasRenderingContext2D, cursor, box_size: number): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.save();
		context.translate(center.x, center.y);
		context.rotate(element.rotation);

		bounds.x = -bounds.width / 2 - Math.sign(bounds.width) * box_size;
		bounds.y = -bounds.height / 2 - Math.sign(bounds.height) * box_size;
		bounds.width += Math.sign(bounds.width) * box_size * 2;
		bounds.height += Math.sign(bounds.height) * box_size * 2;

		context.beginPath();
		this.boxes(element.id, bounds, box_size * 2).forEach((square) => context.rect(square.x, square.y, square.width, square.height));
		context.restore();

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawDots(element, context: CanvasRenderingContext2D, cursor, color: string, line: number, box_size: number) {
		context.fillStyle = 'white';
		context.strokeStyle = color;
		context.lineWidth = line;
		const hovering = element.points
			.map((dot) => {
				context.beginPath();
				context.arc(dot.x, dot.y, box_size, 0, 2 * Math.PI);
				const hovering = context.isPointInPath(cursor.x, cursor.y);
				context.fillStyle = hovering ? color : 'white';
				context.fill();
				context.stroke();
				if (hovering) return dot;
			})
			.filter((dot) => dot);
		return hovering.length ? { element, action: 'edit', dot: hovering[0] } : undefined;
	}

	static center(element: ElementType): Position {
		const bounds = this.bound(element);
		return {
			x: bounds.x + bounds.width / 2,
			y: bounds.y + bounds.height / 2,
		};
	}

	static bound(element): Bound {
		return {
			x: element.x,
			y: element.y,
			width: element.width,
			height: element.height,
		};
	}

	static getFill(element): Array<Fill> {
		return element.fill;
	}

	static setFill(element, props) {
		element.fill.forEach((fill) => {
			if (props.id === fill.id) {
				Object.entries(props).forEach(([key, value]) => {
					fill[key] = value;
				});
			}
		});
	}

	static getStroke(element): Array<Stroke> {
		return element.stroke;
	}

	static setStroke(element, props) {
		element.stroke.forEach((stroke) => {
			if (props.id === stroke.id) {
				Object.entries(props).forEach(([key, value]) => {
					stroke[key] = value;
				});
			}
		});
	}

	static getEffect(element): Array<Effect> {
		return element.effect;
	}

	static setEffect(element, props) {
		element.effect.forEach((effect) => {
			if (props.id === effect.id) {
				Object.entries(props).forEach(([key, value]) => {
					effect[key] = value;
				});
			}
		});
	}

	static positiveBound(element): Bound {
		const bounds = this.bound(element);
		return {
			x: Math.min(bounds.x, bounds.x + bounds.width),
			y: Math.min(bounds.y, bounds.y + bounds.height),
			width: Math.abs(bounds.width),
			height: Math.abs(bounds.height),
		};
	}

	static points(element) {
		return [this.center(element)];
	}

	static move(element, position, last_position) {
		element.x += position.x - last_position.x;
		element.y += position.y - last_position.y;
	}

	static rotate(element, position, last_position) {
		const center = this.center(element);
		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);
		element.rotation += rotation;
	}

	static edit(element: ElementType, position: Position, last_position: Position, dot) {
		element.points[dot.i].x += position.x - last_position.x;
		element.points[dot.i].y += position.y - last_position.y;

		// if (element.points[dot.i].x < 0) {
		// 	const delta_x = -element.points[dot.i].x;
		// 	element.x -= delta_x;
		// 	element.points.forEach((point) => (point.x += delta_x));
		// }
		// if (element.points[dot.i].y < 0) {
		// 	const delta_y = -element.points[dot.i].y;
		// 	element.y -= delta_y;
		// 	element.points.forEach((point) => (point.y += delta_y));
		// }
	}

	static boxes(id, bounds, box_size) {
		return [
			{
				id: id,
				x: bounds.x - box_size,
				y: bounds.y - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
			{
				id: id,
				x: bounds.x + bounds.width - box_size,
				y: bounds.y - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
			{
				id: id,
				x: bounds.x - box_size,
				y: bounds.y + bounds.height - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
			{
				id: id,
				x: bounds.x + bounds.width - box_size,
				y: bounds.y + bounds.height - box_size,
				width: box_size * 2,
				height: box_size * 2,
			},
		];
	}
}
