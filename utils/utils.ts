export function round(number, decimals) {
	return Math.round(number * 10 ** decimals) / 10 ** decimals;
}
