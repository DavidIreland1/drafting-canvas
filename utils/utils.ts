export function round(number: number, decimals: number): number {
	return Math.round(number * 10 ** decimals) / 10 ** decimals;
}

export function clamp(min: number, num: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

export function generateID(length: number = 10): string {
	return Array(length)
		.fill(null)
		.map(() => Math.random().toString(36).slice(2, 3))
		.join('')
		.toUpperCase();
}

export function pastelColor(): string {
	return 'hsl(' + Math.round(360 * Math.random()) + ',' + Math.round(25 + 70 * Math.random()) + '%,' + Math.round(75 + 10 * Math.random()) + '%)';
}

export function clone(data: object): object {
	return JSON.parse(JSON.stringify(data));
}

export function transformPoint(point: { x: number; y: number }, transform: { a: number; b: number; c: number; d: number; e: number; f: number }): { x: number; y: number } {
	return {
		x: transform.a * point.x + transform.c * point.y + transform.e,
		y: transform.b * point.x + transform.d * point.y + transform.f,
	};
}

export function screenBounds(context: CanvasRenderingContext2D, view: { x: number; y: number; scale: number }): { x1: number; y1: number; x2: number; y2: number } {
	return {
		x1: -view.x / view.scale,
		y1: -view.y / view.scale,
		x2: -view.x / view.scale + context.canvas.width / view.scale,
		y2: -view.y / view.scale + context.canvas.height / view.scale,
	};
}

export function rotatePoint(point, center, sin, cos) {
	const delta_x = point.x - center.x;
	const delta_y = point.y - center.y;
	return {
		x: delta_x * cos - delta_y * sin + center.x,
		y: delta_x * sin + delta_y * cos + center.y,
	};
}

export function reflectPoint(point, center) {
	return {
		x: center.x - (point.x - center.x),
		y: center.y - (point.y - center.y),
	};
}

// Splits array into two arrays
export function split(array: Array<any>, comparison: Function): [Array<any>, Array<any>] {
	return array.reduce(([pass, fail], element) => (comparison(element) ? [[...pass, element], fail] : [pass, [...fail, element]]), [[], []]);
}

export function DOMToCanvas(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((position.x - bounds.x) * window.devicePixelRatio - view.x) / view.scale,
		y: ((position.y - bounds.y) * window.devicePixelRatio - view.y) / view.scale,
	};
}

export function CanvasToDOM(position, canvas, view) {
	const bounds = canvas.getBoundingClientRect();
	return {
		x: ((position.x + view.x) * view.scale) / window.devicePixelRatio + bounds.x,
		y: ((position.y + view.y) * view.scale) / window.devicePixelRatio + bounds.y,
	};
}

export function toReadableDuration(milliseconds, decimal_places = 0) {
	const seconds = Number(Math.round(milliseconds / 1000).toFixed(decimal_places));

	if (seconds < 60) return seconds + (seconds === 1 ? ' second' : ' seconds');

	const minutes = Number((seconds / 60).toFixed(decimal_places));
	if (minutes < 60) return minutes + (minutes === 1 ? ' min' : ' mins');

	const hours = Number((minutes / 60).toFixed(decimal_places));
	if (hours < 24) return hours + (hours === 1 ? ' hour' : ' hours');

	const days = Number((hours / 24).toFixed(decimal_places));
	if (days < 7) return days + (days === 1 ? ' day' : ' days');

	const months = Number((days / 31).toFixed(decimal_places));
	if (months < 12) return months + (months === 1 ? ' month' : ' months');

	const years = Number((days / 365).toFixed(decimal_places));
	return years + (years === 1 ? ' year' : ' years');
}
