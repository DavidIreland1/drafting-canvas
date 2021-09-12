import Elements from '../components/elements/elements';

export function round(number, decimals) {
	return Math.round(number * 10 ** decimals) / 10 ** decimals;
}

export function generateID() {
	return String(Math.random()).slice(10);
}

export function dedup(selected) {
	return [...new Set(selected.map((element) => Elements[element.type].getFill(element)).flat())];
}
