import { Bound, Position } from '../../../types/box-types';
import { Effect, ElementType, Fill, Stroke } from '../../../types/element-types';
import { reflectPoint, rotatePoint } from '../../../utils/utils';
import boundBezier from '../bound-bezier';
import roundedPoly from '../rounded-poly';
import Colors from './../../properties/colors';
import Elements from './elements';

// context.setTransform(horizontal_scaling, horizontal_skewing, vertical_skewing, vertical_scaling, horizontal_translation, vertical_translation);

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
			points: this.makePoints(id, position.x, position.y, 1, 1, 0),
			rotation: 0,
			visible: true,
			locked: false,
		};
	}

	static makePoints(id, x, y, width, height, radius) {
		return [
			{ x: x, y: y },
			{ x: x + width, y: y },
			{ x: x + width, y: y + height },
			{ x: x, y: y + height },
		].map((point, i) => ({ ...point, id: id + i, radius, relation: 'Mirror angle and length', controls: [] }));
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
					if (!images[fill.src]) {
						images[fill.src] = new Image();
						images[fill.src].src = fill.src;
						images[fill.src].onerror = () => (images[fill.src].broken = true);
						images[fill.src].onload = () => (window as any).redraw();
					} else if (images[fill.src].complete && !images[fill.src].broken) {
						const bounds = this.bound(element);
						const center = this.center(element);
						context.save();
						context.clip(path);
						context.translate(center.x, center.y);
						context.rotate(element.rotation);
						context.drawImage(images[fill.src], fill.x - bounds.width / 2, fill.y - bounds.height / 2, bounds.width, bounds.height);
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

	static underEffect(element, context: CanvasRenderingContext2D, path: Path2D, view) {
		const center = this.center(element);
		element.effect
			.filter((effect) => effect.visible)
			.forEach((effect) => {
				if (effect.type === 'Drop shadow') {
					context.save();
					context.filter = `blur(${effect.blur * 0.2 * view.scale}px)`;
					context.fillStyle = Colors.toString(effect.color);
					context.translate(center.x, center.y);
					const spread = Math.exp(effect.spread * 0.005);
					context.scale(spread, spread);
					context.translate(-center.x, -center.y);
					context.translate(effect.x, effect.y);
					context.fill(path);
					context.restore();
				}
			});
	}

	static overEffect(element, context: CanvasRenderingContext2D, path: Path2D, view) {
		const center = this.center(element);
		element.effect
			.filter((effect) => effect.visible)
			.forEach((effect) => {
				if (effect.type === 'Inner shadow') {
					context.save();
					context.filter = `blur(${effect.blur * 0.2 * view.scale}px)`;
					context.fillStyle = Colors.toString(effect.color);
					context.clip(path);
					context.translate(effect.x, effect.y);
					const spread = Math.exp(-effect.spread * 0.005);
					context.translate(center.x, center.y);
					context.scale(spread, spread);
					context.translate(-center.x, -center.y);
					const clone = new Path2D(path);
					clone.rect(Number.MAX_SAFE_INTEGER / 2, -Number.MAX_SAFE_INTEGER / 2, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
					context.fill(clone);
					context.restore();
				}
			});
	}

	static draw(element, context: CanvasRenderingContext2D, cursor, view): any {
		const path = this.path(element);
		this.underEffect(element, context, path, view);
		this.fill(element, context, path);
		this.overEffect(element, context, path, view);
		const fill = element.fill.length && context.isPointInPath(path, cursor.x, cursor.y);
		context.lineWidth = this.stroke(element, context, path);
		const stroke = element.stroke.length && context.isPointInStroke(path, cursor.x, cursor.y);
		return fill || stroke ? element : undefined;
	}

	static resize(element, position, last_position): void {
		const center = this.center(element);
		const bounds = this.bound(element);

		const sin = Math.sin(element.rotation);
		const cos = Math.cos(element.rotation);

		// Rotate all points to 0 deg
		const normal_last_position = rotatePoint(last_position, center, -sin, cos);
		const normal_position = rotatePoint(position, center, -sin, cos);

		rotatePoints(element, center, -sin, cos);

		const delta_x = (normal_last_position.x - normal_position.x) * (normal_last_position.x < center.x ? 1 : -1);
		const delta_y = (normal_last_position.y - normal_position.y) * (normal_last_position.y < center.y ? 1 : -1);

		// Get change ratio in width and height
		const width_ratio = (bounds.width + delta_x) / bounds.width || 0.0000001; // avoid ratio of zero
		const height_ratio = (bounds.height + delta_y) / bounds.height || 0.0000001; // avoid ratio of zero

		// Top left of old bounding box
		const old_x_min = Math.min(...Elements[element.type].getPoints(element).map((point) => point.x));
		const old_y_min = Math.min(...Elements[element.type].getPoints(element).map((point) => point.y));

		// Top left of new bounding box
		const new_x_min = normal_last_position.x < center.x ? old_x_min - delta_x : old_x_min;
		const new_y_min = normal_last_position.y < center.y ? old_y_min - delta_y : old_y_min;

		scalePoints(element, 'x', old_x_min, width_ratio, new_x_min);
		scalePoints(element, 'y', old_y_min, height_ratio, new_y_min);

		// Rotate points back
		rotatePoints(element, center, sin, cos);
	}

	static stretch(element, position, last_position): void {
		const center = this.center(element);
		const bounds = this.bound(element);

		const sin = Math.sin(element.rotation);
		const cos = Math.cos(element.rotation);

		// Rotate all points to 0 deg
		const normal_last_position = rotatePoint(last_position, center, -sin, cos);
		const normal_position = rotatePoint(position, center, -sin, cos);
		rotatePoints(element, center, -sin, cos);

		const delta_y = (normal_last_position.y - normal_position.y) * (normal_last_position.y < center.y ? 1 : -1);
		const height_ratio = (bounds.height + delta_y) / bounds.height || 0.0000001; // avoid ratio of zero

		// Top left of resize box
		const old_y_min = Math.min(...Elements[element.type].getPoints(element).map((point) => point.y));
		const new_y_min = normal_last_position.y < center.y ? old_y_min - delta_y : old_y_min;

		scalePoints(element, 'y', old_y_min, height_ratio, new_y_min);

		// Rotate points back
		rotatePoints(element, center, sin, cos);
	}

	static spread(element, position, last_position): void {
		const center = this.center(element);
		const bounds = this.bound(element);

		const sin = Math.sin(element.rotation);
		const cos = Math.cos(element.rotation);

		// Rotate all points to 0 deg
		const normal_last_position = rotatePoint(last_position, center, -sin, cos);
		const normal_position = rotatePoint(position, center, -sin, cos);
		rotatePoints(element, center, -sin, cos);

		const delta_x = (normal_last_position.x - normal_position.x) * (normal_last_position.x < center.x ? 1 : -1);
		const width_ratio = (bounds.width + delta_x) / bounds.width || 0.0000001; // avoid ratio of zero

		// Top left of resize box
		const old_x_min = Math.min(...Elements[element.type].getPoints(element).map((point) => point.x));
		const new_x_min = normal_last_position.x < center.x ? old_x_min - delta_x : old_x_min;

		scalePoints(element, 'x', old_x_min, width_ratio, new_x_min);

		// Rotate points back
		rotatePoints(element, center, sin, cos);
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

	static highlight(element, context, cursor, highlight, line, box_size, box_color) {
		let action = undefined;

		const center = this.center(element);
		context.save();
		context.translate(center.x, center.y);
		context.rotate(element.rotation);

		if (this.drawStretch(element, context, cursor, highlight, line)) action = 'stretch';
		if (this.drawSpread(element, context, cursor, highlight, line)) action = 'spread';
		if (this.drawRotate(element, context, cursor, box_size)) action = 'rotate';
		if (this.drawResize(element, context, cursor, highlight, line, box_size, box_color)) action = 'resize';

		context.rotate(-element.rotation);
		context.translate(-center.x, -center.y);

		return action ? { action, element } : undefined;
	}

	static insideBound(element, context: CanvasRenderingContext2D, cursor): boolean {
		const bounds = this.bound(element);
		const center = this.center(element);

		context.save();
		context.translate(center.x, center.y);
		context.rotate(element.rotation);
		context.beginPath();
		context.rect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
		context.rotate(-element.rotation);
		context.translate(-center.x, -center.y);

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawStretch(element, context: CanvasRenderingContext2D, cursor, color: string, line: number): boolean {
		const bounds = this.bound(element);

		context.strokeStyle = color;
		context.lineWidth = line;

		const path = new Path2D();
		path.moveTo(-bounds.width / 2, -bounds.height / 2);
		path.lineTo(bounds.width / 2, -bounds.height / 2);
		path.moveTo(-bounds.width / 2, bounds.height / 2);
		path.lineTo(bounds.width / 2, bounds.height / 2);
		context.stroke(path);
		context.lineWidth = line * 4;
		return context.isPointInStroke(path, cursor.x, cursor.y);
	}

	static drawSpread(element, context: CanvasRenderingContext2D, cursor, color: string, line: number): boolean {
		const bounds = this.bound(element);
		context.strokeStyle = color;
		context.lineWidth = line;
		const path = new Path2D();
		path.moveTo(bounds.width / 2, -bounds.height / 2);
		path.lineTo(bounds.width / 2, bounds.height / 2);
		path.moveTo(-bounds.width / 2, bounds.height / 2);
		path.lineTo(-bounds.width / 2, -bounds.height / 2);
		context.stroke(path);
		context.lineWidth = line * 4;
		return context.isPointInStroke(path, cursor.x, cursor.y);
	}

	static drawResize(element, context: CanvasRenderingContext2D, cursor, color: string, line: number, box_size: number, box_color: string): boolean {
		const bounds = this.bound(element);

		bounds.x = -bounds.width / 2;
		bounds.y = -bounds.height / 2;
		context.fillStyle = box_color;
		context.strokeStyle = color;
		context.lineWidth = line;

		context.beginPath();
		this.boxes(element.id, bounds, box_size).forEach((square) => context.rect(square.x, square.y, square.width, square.height));
		// Check if zoomed in enough
		if (Math.abs(bounds.width) + Math.abs(bounds.height) > box_size * 4) {
			context.fill();
			context.stroke();
		}
		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawRotate(element, context: CanvasRenderingContext2D, cursor, box_size: number): boolean {
		const bounds = this.bound(element);

		bounds.x = -bounds.width / 2 - Math.sign(bounds.width) * box_size;
		bounds.y = -bounds.height / 2 - Math.sign(bounds.height) * box_size;
		bounds.width += Math.sign(bounds.width) * box_size * 2;
		bounds.height += Math.sign(bounds.height) * box_size * 2;

		context.beginPath();
		this.boxes(element.id, bounds, box_size * 2).forEach((square) => context.rect(square.x, square.y, square.width, square.height));

		return context.isPointInPath(cursor.x, cursor.y);
	}

	static drawPoints(element, context: CanvasRenderingContext2D, cursor, color: string, line: number, box_size: number, box_color: string) {
		context.strokeStyle = color;
		context.lineWidth = line;
		const diamond_size = box_size * 0.7;

		const hovering = Elements[element.type]
			.getPoints(element)
			.map((point) => {
				context.fillStyle = box_color;
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
						context.fillStyle = hovering ? color : box_color;
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
				context.fillStyle = hovering ? color : box_color;
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

		const point2 = Elements[element.type].getPoints(element).find((p) => p.id === point.id);
		if (point.control !== undefined) {
			const control = point2.controls[point.control];
			const opposite = point2.controls[point.control === 0 ? 1 : 0];
			control.x += delta_x;
			control.y += delta_y;

			if (point2.relation === 'Mirror angle and length') {
				const reflected = reflectPoint(point2.controls[point.control], point2);
				opposite.x = reflected.x;
				opposite.y = reflected.y;
			} else if (point2.relation === 'Mirror angle') {
				const distance = Math.sqrt((opposite.x - point2.x) ** 2 + (opposite.y - point2.y) ** 2);
				const new_angle = Math.PI / 2 - Math.atan2(point2.x - control.x, point2.y - control.y);
				opposite.x = point2.x + distance * Math.cos(new_angle);
				opposite.y = point2.y + distance * Math.sin(new_angle);
			}
		} else {
			point2.x += delta_x;
			point2.y += delta_y;

			Elements[element.type]
				.getPoints(element)
				.find((p) => p.id === point.id)
				.controls.forEach((control) => {
					control.x += delta_x;
					control.y += delta_y;
				});
		}
	}

	static center(element: ElementType): Position {
		const sin = Math.sin(element.rotation);
		const cos = Math.cos(element.rotation);

		const points = Elements[element.type]
			.getPoints(element)
			.map((point) => ({
				...rotatePoint(point, { x: 0, y: 0 }, -sin, cos),
				controls: point.controls.map((control) => rotatePoint(control, { x: 0, y: 0 }, -sin, cos)),
			}))
			.map((point, i, points) => boundBezier(point, points[(i + 1) % points.length]))
			.flat();

		const xs = points.map((point) => point.x);
		const ys = points.map((point) => point.y);
		const x_min = Math.min(...xs);
		const x_max = Math.max(...xs);
		const y_min = Math.min(...ys);
		const y_max = Math.max(...ys);

		return rotatePoint({ x: x_min + (x_max - x_min) / 2, y: y_min + (y_max - y_min) / 2 }, { x: 0, y: 0 }, sin, cos);
	}

	static bound(element: ElementType): Bound {
		const center = this.center(element);

		const sin = Math.sin(element.rotation);
		const cos = Math.cos(element.rotation);

		const points = Elements[element.type]
			.getPoints(element)
			.map((point) => ({
				...rotatePoint(point, center, -sin, cos),
				controls: point.controls.map((control) => rotatePoint(control, center, -sin, cos)),
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
	}

	static rotate(element, position, last_position) {
		const center = this.center(element);
		const rotation = Math.atan2(center.y - position.y, center.x - position.x) - Math.atan2(center.y - last_position.y, center.x - last_position.x);

		const sin = Math.sin(rotation);
		const cos = Math.cos(rotation);

		rotatePoints(element, center, sin, cos);
		this.addRotation(element, rotation);
	}

	static addRotation(element, rotation) {
		element.rotation = (element.rotation + rotation) % (Math.PI * 2);
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

export function rotatePoints(element, center, sin, cos) {
	Elements[element.type].getPoints(element).forEach((point) => {
		const rotated = rotatePoint(point, center, sin, cos);
		point.x = rotated.x;
		point.y = rotated.y;

		point.controls.forEach((control) => {
			const rotated = rotatePoint(control, center, sin, cos);
			control.x = rotated.x;
			control.y = rotated.y;
		});
	});
}

export function scalePoints(element, dimension, old_min, ratio, new_min) {
	Elements[element.type].getPoints(element).forEach((point) => {
		point[dimension] = (point[dimension] - old_min) * ratio + new_min;

		point.controls.forEach((control) => {
			control[dimension] = (control[dimension] - old_min) * ratio + new_min;
		});
	});
}
