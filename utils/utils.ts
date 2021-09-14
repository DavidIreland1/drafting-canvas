export function round(number, decimals) {
	return Math.round(number * 10 ** decimals) / 10 ** decimals;
}

export function generateID() {
	return String(Math.random()).slice(10);
}
