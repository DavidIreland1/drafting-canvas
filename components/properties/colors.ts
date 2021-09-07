// All values are [0-1]

export default {
	rgbaToString: ([r, g, b, a]) => {
		return `rgba(${r * 255},${g * 255},${b * 255},${a})`;
	},
	stringToRgba: (color) => {
		if (typeof color !== 'string') return color;
		const div = document.createElement('div');
		div.style.background = color;
		document.body.appendChild(div);
		color = getComputedStyle(div).backgroundColor;
		div.remove();

		color = color
			.split('(')[1]
			.slice(0, -1)
			.split(',')
			.map(Number)
			.map((color, i) => (i < 3 ? color / 255 : color));

		if (color.length < 4) color.push(1);

		return color;
	},
	rgbaToHex: ([r, g, b, a]) => {
		return `#${[r, g, b, a]
			.map((color) =>
				Math.round(255 * color)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')}`.toUpperCase();
	},
	hslaToRgba: ([h, s, l, a]): [number, number, number, number] => {
		const b = s * Math.min(l, 1 - l);
		const f = (n) => {
			const k = (n + h * 12) % 12;
			return l - b * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		};
		return [f(0), f(8), f(4), a];
	},
	hsvaToHsla: ([h, s, v, a]): [number, number, number, number] => {
		const l = ((2 - s) * v) / 2;
		if (l !== 0) {
			if (l === 1) {
				s = 0;
			} else if (l < 0.5) {
				s = (s * v) / (l * 2);
			} else {
				s = (s * v) / (2 - l * 2);
			}
		}
		return [h, s, l, a];
	},
	hslaToHsba: ([h, s, l, a]): [number, number, number, number] => {
		const hsv1 = s * (l < 0.5 ? l : 1 - l);
		const hsvS = hsv1 === 0 ? 0 : (2 * hsv1) / (l + hsv1);
		const hsvV = l + hsv1;
		return [h, hsvS, hsvV, a];
	},
	rgbaToHsla: ([r, g, b, a]): [number, number, number, number] => {
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h;
		let s;
		const l = (max + min) / 2;

		if (max === min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return [h, s, l, a];
	},
	hexToRgba: (hex): [number, number, number, number] => {
		const r = parseInt(hex.substr(1, 2), 16) / 255;
		const g = parseInt(hex.substr(3, 2), 16) / 255;
		const b = parseInt(hex.substr(5, 2), 16) / 255;
		const a = hex.length > 7 ? parseInt(hex.substr(7, 2), 16) / 255 : 1;

		return [r, g, b, a];
	},
};
