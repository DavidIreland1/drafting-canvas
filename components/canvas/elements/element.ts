import { Bound, Position } from '../../../types/box-types';
import { Effect, ElementType, Fill, Stroke } from '../../../types/element-types';
import { reflectPoint, rotatePoint } from '../../../utils/utils';
import boundBezier from '../bound-bezier';
import roundedPoly from '../rounded-poly';
import Colors from './../../properties/colors';
import Elements from './elements';

const images = {};
export default class Element {
	static create(id: string, position: Position, selected: boolean): ElementType {
		return {
			id: id,
			type: '',
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

	static makePoints(x, y, width, height, radius) {
		return [
			{ x: x, y: y },
			{ x: x + width, y: y },
			{ x: x + width, y: y + height },
			{ x: x, y: y + height },
		].map((point, i) => ({ ...point, i, radius, controls: [] }));
	}

	static path(element): Path2D {
		return roundedPoly(element.points);
	}

	static fill(element, context: CanvasRenderingContext2D, path) {
		element.fill
			.filter((fill) => fill.visible)
			.forEach((fill) => {
				if (fill.type === 'Solid') {
					context.fillStyle = Colors.toString(fill.color);
					context.fill(path);
				} else if (fill.type === 'Image') {
					if (!images[fill.id]) {
						images[fill.id] = new Image();
						images[fill.id].src = fill.src;
						images[fill.id].onerror = () => (images[fill.id].broken = true);
					} else if (images[fill.id].complete && !images[fill.id].broken) {
						const bounds = this.bound(element);
						context.save();
						context.clip(path);
						context.drawImage(images[fill.id], bounds.x + fill.x, bounds.y + fill.y, bounds.width, bounds.height);
						context.restore();
					}
				}
			});
	}

	static stroke(element, context: CanvasRenderingContext2D, path: Path2D) {
		return Math.max(
			...element.stroke
				.filter((stroke) => stroke.visible)
				.map((stroke) => {
					if (stroke.width === 0) return;
					context.save();
					context.strokeStyle = Colors.toString(stroke.color);
					context.lineWidth = stroke.width;
					if (stroke.type === 'Inside') {
						context.clip(path);
						context.lineWidth = stroke.width * 2;
					} else if (stroke.type === 'Outside') {
						const clone = new Path2D(path);
						clone.rect(Number.MAX_SAFE_INTEGER / 2, -Number.MAX_SAFE_INTEGER / 2, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
						context.clip(clone);
						context.lineWidth = stroke.width * 2;
					}
					context.stroke(path); // Center
					context.restore();
					return stroke.width;
				})
		);
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
					context.filter = `blur(${effect.blur * 0.2 * view.scale}px)`;
					context.fillStyle = Colors.toString(effect.color);
					context.clip(path);
					context.translate(effect.x, effect.y);
					context.scale(Math.exp(-effect.spread * 0.005), Math.exp(-effect.spread * 0.005));
					const clone = new Path2D(path);
					clone.rect(Number.MAX_SAFE_INTEGER / 2, -Number.MAX_SAFE_INTEGER / 2, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
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
		context.lineWidth = this.stroke(element, context, path);
		const stroke = element.stroke.length && context.isPointInStroke(path, cursor.x, cursor.y);
		return fill || stroke;
	}

	static resize(element, position, last_position): void {
		const center = this.center(element);
		const bounds = this.bound(element);

		if (bounds.width === 0 || bounds.height === 0) return; // This might be an issue

		// Find opposite corner
		const opposite = reflectPoint(last_position, center);

		// Rotate all points to 0 deg
		const new_opposite = rotatePoint(opposite, center, -element.rotation);
		const new_position = rotatePoint(position, center, -element.rotation);
		Elements[element.type].getPoints(element).forEach((point) => {
			const rotated = rotatePoint(point, center, -element.rotation);
			point.x = rotated.x;
			point.y = rotated.y;

			point.controls.forEach((control) => {
				const rotated = rotatePoint(control, center, -element.rotation);
				control.x = rotated.x;
				control.y = rotated.y;
			});
		});

		// Get change ratio in width and height
		const width_ratio = Math.abs(new_position.x - new_opposite.x) / bounds.width;
		const height_ratio = Math.abs(new_position.y - new_opposite.y) / bounds.height;

		// Top left of bounding box
		const x_min_old = Math.min(...Elements[element.type].getPoints(element).map((point) => point.x));
		const y_min_old = Math.min(...Elements[element.type].getPoints(element).map((point) => point.y));

		// Top left of resize box
		const x_min_new = Math.min(new_opposite.x, new_position.x);
		const y_min_new = Math.min(new_opposite.y, new_position.y);

		// Scale point positions
		Elements[element.type].getPoints(element).forEach((point) => {
			point.x = (point.x - x_min_old) * width_ratio + x_min_new;
			point.y = (point.y - y_min_old) * height_ratio + y_min_new;

			point.controls.forEach((control) => {
				control.x = (control.x - x_min_old) * width_ratio + x_min_new;
				control.y = (control.y - y_min_old) * height_ratio + y_min_new;
			});
		});

		// Rotate points back
		Elements[element.type].getPoints(element).forEach((point) => {
			const rotated = rotatePoint(point, center, element.rotation);
			point.x = rotated.x;
			point.y = rotated.y;

			point.controls.forEach((control) => {
				const rotated = rotatePoint(control, center, element.rotation);
				control.x = rotated.x;
				control.y = rotated.y;
			});
		});
	}

	static stretch(element, position, last_position): void {
		return;
	}

	static outline(element, context: CanvasRenderingContext2D, color: string, line_width: number): void {
		context.strokeStyle = color;
		context.lineWidth = line_width;
		const path = this.path(element);
		context.stroke(path);
	}

	static onScreen(element, screen) {
		const bounds = this.positiveBound(element);
		return !(bounds.x > screen.x2 || bounds.y > screen.y2 || bounds.x + bounds.width < screen.x1 || bounds.y + bounds.height < screen.y1);
	}

	static highlight(element, context, cursor, highlight, line, box) {
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

	// context.setTransform(horizontal_scaling, horizontal_skewing, vertical_skewing, vertical_scaling, horizontal_translation, vertical_translation);

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

	static drawPoints(element, context: CanvasRenderingContext2D, cursor, color: string, line: number, box_size: number) {
		context.strokeStyle = color;
		context.lineWidth = line;
		const diamond_size = box_size * 0.7;

		const hovering = Elements[element.type]
			.getPoints(element)
			.map((point) => {
				context.fillStyle = 'white';
				const control = point.controls
					.map((control, i) => {
						const angle = Math.atan2(control.y - point.y, control.x - point.x) - Math.PI / 4;
						context.beginPath();
						context.moveTo(point.x, point.y);
						context.lineTo(control.x, control.y);
						context.stroke();
						context.beginPath();
						context.translate(control.x, control.y);
						context.rotate(angle);
						context.rect(-diamond_size, -diamond_size, diamond_size * 2, diamond_size * 2);
						context.rotate(-angle);
						context.translate(-control.x, -control.y);
						const hovering = context.isPointInPath(cursor.x, cursor.y);
						context.fillStyle = hovering ? color : 'white';
						context.fill();
						context.stroke();
						if (hovering) return i;
					})
					.filter((control) => control !== undefined)
					.pop();

				context.beginPath();
				context.moveTo(point.x + box_size, point.y);
				context.arc(point.x, point.y, box_size, 0, 2 * Math.PI);
				const hovering = context.isPointInPath(cursor.x, cursor.y);
				context.fillStyle = hovering ? color : 'white';
				context.fill();
				context.stroke();

				if (hovering || control !== undefined) return { ...point, control }; //can replace this for index
			})
			.filter((point) => point)
			.pop();
		return hovering ? { element, action: 'edit', point: hovering } : undefined;
	}

	static edit(element: ElementType, position: Position, last_position: Position, point) {
		const delta_x = position.x - last_position.x;
		const delta_y = position.y - last_position.y;

		if (point.control !== undefined) {
			Elements[element.type].getPoints(element)[point.i].controls[point.control].x += delta_x;
			Elements[element.type].getPoints(element)[point.i].controls[point.control].y += delta_y;

			if (true || Elements[element.type].getPoints(element)[point.i].mirror === '') {
				const opposite = point.control === 0 ? 1 : 0;
				Elements[element.type].getPoints(element)[point.i].controls[opposite].x -= delta_x;
				Elements[element.type].getPoints(element)[point.i].controls[opposite].y -= delta_y;
			}
		} else {
			Elements[element.type].getPoints(element)[point.i].x += delta_x;
			Elements[element.type].getPoints(element)[point.i].y += delta_y;

			Elements[element.type].getPoints(element)[point.i].controls.forEach((control) => {
				control.x += delta_x;
				control.y += delta_y;
			});
		}
	}

	static center(element: ElementType): Position {
		// const points = Elements[element.type].getPoints(element).map((point) => rotatePoint(point, { x: 0, y: 0 }, -element.rotation));
		const points = Elements[element.type]
			.getPoints(element)
			.map((point) => ({
				...rotatePoint(point, { x: 0, y: 0 }, -element.rotation),
				controls: point.controls.map((control) => rotatePoint(control, { x: 0, y: 0 }, -element.rotation)),
			}))
			.map((point, i, points) => boundBezier(point, points[(i + 1) % points.length]))
			.flat();

		const xs = points.map((point) => point.x);
		const ys = points.map((point) => point.y);
		const x_min = Math.min(...xs);
		const x_max = Math.max(...xs);
		const y_min = Math.min(...ys);
		const y_max = Math.max(...ys);

		return rotatePoint(
			{
				x: x_min + (x_max - x_min) / 2,
				y: y_min + (y_max - y_min) / 2,
			},
			{ x: 0, y: 0 },
			element.rotation
		);
	}

	static bound(element: ElementType): Bound {
		const center = this.center(element);

		const points = Elements[element.type]
			.getPoints(element)
			.map((point) => ({
				...rotatePoint(point, center, -element.rotation),
				controls: point.controls.map((control) => rotatePoint(control, center, -element.rotation)),
			}))
			.map((point, i, points) => boundBezier(point, points[(i + 1) % points.length]))
			.flat();

		const xs = points.map((point) => point.x);
		const ys = points.map((point) => point.y);
		const x_min = Math.min(...xs);
		const x_max = Math.max(...xs);
		const y_min = Math.min(...ys);
		const y_max = Math.max(...ys);

		return {
			x: x_min,
			y: y_min,
			width: x_max - x_min,
			height: y_max - y_min,
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

	static getPoints(element) {
		return element.points;
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
		return Elements[element.type].getPoints(element).concat(this.center(element));
	}

	static move(element, position, last_position) {
		const delta_x = position.x - last_position.x;
		const delta_y = position.y - last_position.y;

		Elements[element.type].getPoints(element).forEach((point) => {
			point.x += delta_x;
			point.y += delta_y;

			point.controls.forEach((control) => {
				control.x += delta_x;
				control.y += delta_y;
			});
		});

		if (Array.isArray(element.elements)) element.elements.forEach((element) => Elements[element.type].move(element, position, last_position));
	}

	static rotate(element, position, last_position) {
		const center = this.center(element);
		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

		Elements[element.type].getPoints(element).forEach((point) => {
			const rotated = rotatePoint(point, center, rotation);
			point.x = rotated.x;
			point.y = rotated.y;

			point.controls.forEach((control) => {
				const rotated = rotatePoint(control, center, rotation);
				control.x = rotated.x;
				control.y = rotated.y;
			});
		});
		this.addRotation(element, rotation);
	}

	static addRotation(element, rotation) {
		element.rotation += rotation;
		if (Array.isArray(element.elements)) element.elements.forEach((element) => Elements[element.type].addRotation(element, rotation));
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
