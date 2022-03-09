// All values are [0-1]

import { round } from '../../utils/utils';

const Colors = {
	toString: (hsla, type = 'hsla'): string => {
		switch (type) {
			case 'hsl':
				return Colors.toHslString(hsla);
			case 'hsla':
				return Colors.toHslaString(hsla);
			case 'hsb':
				return Colors.toHsbString(hsla);
			case 'hsba':
				return Colors.toHsbaString(hsla);
			case 'rgb':
				return Colors.toRgbString(Colors.hslaToRgba(hsla));
			case 'rgba':
				return Colors.toRgbaString(Colors.hslaToRgba(hsla));
			case 'hex3':
				return Colors.rgbaToHex4(Colors.hslaToRgba(hsla).slice(0, 3));
			case 'hex4':
				return Colors.rgbaToHex4(Colors.hslaToRgba(hsla));
			case 'hex6':
				return Colors.rgbaToHex8(Colors.hslaToRgba(hsla).slice(0, 3));
			case 'hex8':
				return Colors.rgbaToHex8(Colors.hslaToRgba(hsla).slice(0, 3));
			case 'name':
				return names[Colors.toString(hsla, 'hex6')];
		}
	},
	toHslString: ([h, s, l, a]) => {
		return `hsl(${Math.floor(h * 360)},${Math.floor(s * 100)}%,${Math.floor(l * 100)}%)`;
	},
	toHslaString: ([h, s, l, a]) => {
		return `hsla(${Math.floor(h * 360)},${Math.floor(s * 100)}%,${Math.floor(l * 100)}%,${round(a, 2)})`;
	},
	toHsbString: ([h, s, l, a]) => {
		return `hsb(${Math.floor(h * 360)},${Math.floor(s * 100)}%,${Math.floor(l * 100)}%)`;
	},
	toHsbaString: ([h, s, l, a]) => {
		return `hsba(${Math.floor(h * 360)},${Math.floor(s * 100)}%,${Math.floor(l * 100)}%,${round(a, 2)})`;
	},
	toRgbString: ([r, g, b, a]) => {
		return `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)})`;
	},
	toRgbaString: ([r, g, b, a]) => {
		return `rgba(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)}, ${round(a, 2)})`;
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
	rgbaToHex4: (rgba) => {
		return `#${rgba.map((color) => Math.round(15 * color).toString(16)).join('')}`.toUpperCase();
	},
	rgbaToHex8: (rgba) => {
		return `#${rgba
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
	hsbaToHsla: ([h, s, b, a]): [number, number, number, number] => {
		const l = ((2 - s) * b) / 2;
		if (l !== 0) {
			if (l === 1) {
				s = 0;
			} else if (l < 0.5) {
				s = (s * b) / (l * 2);
			} else {
				s = (s * b) / (2 - l * 2);
			}
		}
		return [h, s, l, a];
	},
	hslaToHsba: ([h, s, l, a]): [number, number, number, number] => {
		const hsb1 = s * (l < 0.5 ? l : 1 - l);
		const hsbS = hsb1 === 0 ? 0 : (2 * hsb1) / (l + hsb1);
		const hsbV = l + hsb1;
		return [h, hsbS, hsbV, a];
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
	isValid: (color: string): boolean => {
		return CSS.supports('color', color);
	},
	getFormat: (color: string): string => {
		color = color.toLowerCase();
		if (Colors.isValid(color) === false) return '';
		if (color.startsWith('#')) return 'hex' + (color.length - 1);
		if (color.includes('(')) return color.split('(')[0];
		return 'name';
	},
};

if (typeof window !== 'undefined') {
	(window as any).Colors = Colors;
}

export default Colors;

const names = {
	'#F0F8FF': 'aliceblue',
	'#FAEBD7': 'antiquewhite',
	'#00FFFF': 'aqua',
	'#7FFFD4': 'aquamarine',
	'#F0FFFF': 'azure',
	'#F5F5DC': 'beige',
	'#FFE4C4': 'bisque',
	'#000000': 'black',
	'#FFEBCD': 'blanchedalmond',
	'#0000FF': 'blue',
	'#8A2BE2': 'blueviolet',
	'#A52A2A': 'brown',
	'#DEB887': 'burlywood',
	'#5F9EA0': 'cadetblue',
	'#7FFF00': 'chartreuse',
	'#D2691E': 'chocolate',
	'#FF7F50': 'coral',
	'#6495ED': 'cornflowerblue',
	'#FFF8DC': 'cornsilk',
	'#DC143C': 'crimson',
	'#00008B': 'darkblue',
	'#008B8B': 'darkcyan',
	'#B8860B': 'darkgoldenrod',
	'#A9A9A9': 'darkgray',
	'#006400': 'darkgreen',
	'#BDB76B': 'darkkhaki',
	'#8B008B': 'darkmagenta',
	'#556B2F': 'darkolivegreen',
	'#FF8C00': 'darkorange',
	'#9932CC': 'darkorchid',
	'#8B0000': 'darkred',
	'#E9967A': 'darksalmon',
	'#8FBC8F': 'darkseagreen',
	'#483D8B': 'darkslateblue',
	'#2F4F4F': 'darkslategray',
	'#00CED1': 'darkturquoise',
	'#9400D3': 'darkviolet',
	'#FF1493': 'deeppink',
	'#00BFFF': 'deepskyblue',
	'#696969': 'dimgray',
	'#1E90FF': 'dodgerblue',
	'#B22222': 'firebrick',
	'#FFFAF0': 'floralwhite',
	'#228B22': 'forestgreen',
	'#FF00FF': 'fuchsia',
	'#DCDCDC': 'gainsboro',
	'#F8F8FF': 'ghostwhite',
	'#FFD700': 'gold',
	'#DAA520': 'goldenrod',
	'#ADFF2F': 'greenyellow',
	'#808080': 'gray',
	'#008000': 'green',
	'#F0FFF0': 'honeydew',
	'#FF69B4': 'hotpink',
	'#CD5C5C': 'indianred',
	'#4B0082': 'indigo',
	'#FFFFF0': 'ivory',
	'#F0E68C': 'khaki',
	'#E6E6FA': 'lavender',
	'#FFF0F5': 'lavenderblush',
	'#7CFC00': 'lawngreen',
	'#FFFACD': 'lemonchiffon',
	'#ADD8E6': 'lightblue',
	'#F08080': 'lightcoral',
	'#E0FFFF': 'lightcyan',
	'#FAFAD2': 'lightgoldenrodyellow',
	'#D3D3D3': 'lightgray',
	'#90EE90': 'lightgreen',
	'#FFB6C1': 'lightpink',
	'#FFA07A': 'lightsalmon',
	'#20B2AA': 'lightseagreen',
	'#87CEFA': 'lightskyblue',
	'#778899': 'lightslategray',
	'#FFFFE0': 'lightyellow',
	'#00FF00': 'lime',
	'#32CD32': 'limegreen',
	'#FAF0E6': 'linen',
	'#800000': 'maroon',
	'#66CDAA': 'mediumaquamarine',
	'#0000CD': 'mediumblue',
	'#BA55D3': 'mediumorchid',
	'#9370DB': 'mediumpurple',
	'#3CB371': 'mediumseagreen',
	'#7B68EE': 'mediumslateblue',
	'#00FA9A': 'mediumspringgreen',
	'#48D1CC': 'mediumturquoise',
	'#C71585': 'mediumvioletred',
	'#191970': 'midnightblue',
	'#F5FFFA': 'mintcream',
	'#FFE4E1': 'mistyrose',
	'#FFE4B5': 'moccasin',
	'#FFDEAD': 'navajowhite',
	'#000080': 'navy',
	'#FDF5E6': 'oldlace',
	'#808000': 'olive',
	'#6B8E23': 'olivedrab',
	'#FFA500': 'orange',
	'#FF4500': 'orangered',
	'#DA70D6': 'orchid',
	'#EEE8AA': 'palegoldenrod',
	'#98FB98': 'palegreen',
	'#AFEEEE': 'paleturquoise',
	'#DB7093': 'palevioletred',
	'#FFEFD5': 'papayawhip',
	'#FFDAB9': 'peachpuff',
	'#CD853F': 'peru',
	'#FFC0CB': 'pink',
	'#DDA0DD': 'plum',
	'#B0E0E6': 'powderblue',
	'#800080': 'purple',
	'#663399': 'rebeccapurple',
	'#FF0000': 'red',
	'#BC8F8F': 'rosybrown',
	'#4169E1': 'royalblue',
	'#8B4513': 'saddlebrown',
	'#FA8072': 'salmon',
	'#F4A460': 'sandybrown',
	'#2E8B57': 'seagreen',
	'#FFF5EE': 'seashell',
	'#A0522D': 'sienna',
	'#C0C0C0': 'silver',
	'#87CEEB': 'skyblue',
	'#6A5ACD': 'slateblue',
	'#708090': 'slategray',
	'#FFFAFA': 'snow',
	'#00FF7F': 'springgreen',
	'#4682B4': 'steelblue',
	'#D2B48C': 'tan',
	'#008080': 'teal',
	'#D8BFD8': 'thistle',
	'#FF6347': 'tomato',
	'#40E0D0': 'turquoise',
	'#EE82EE': 'violet',
	'#F5DEB3': 'wheat',
	'#FFFFFF': 'white',
	'#F5F5F5': 'whitesmoke',
	'#FFFF00': 'yellow',
	'#9ACD32': 'yellowgreen',
};
