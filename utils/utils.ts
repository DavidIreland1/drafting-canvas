export function round(number, decimals) {
	return Math.round(number * 10 ** decimals) / 10 ** decimals;
}

export function clamp(min, num, max) {
	return Math.min(Math.max(num, min), max);
}

export function generateID(length = 10) {
	return Array(length)
		.fill(null)
		.map((ele) => Math.random().toString(36).slice(2, 3))
		.join('')
		.toUpperCase();
}

export function pastelColor() {
	return 'hsl(' + Math.round(360 * Math.random()) + ',' + Math.round(25 + 70 * Math.random()) + '%,' + Math.round(75 + 10 * Math.random()) + '%)';
}
