import Adjective from './../utils/adjectives';
import Animal from './../utils/animals';
import { generateID, pastelColor } from '../utils/utils';

const id = generateID();

console.log(Adjective + ' ' + Animal, id);

const device_pixel_ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio;

const Settings = {
	user: {
		id: id,
		label: Adjective + ' ' + Animal,
		color: pastelColor(),
	},
	line: {
		width: 1 * device_pixel_ratio,
	},
	box: {
		size: 4 * device_pixel_ratio,
		color: '#fff',
	},
	cross: {
		color: '#F55',
	},
	highlight: '#0084ff',
	zoom: {
		max: 500,
		min: 0.0001,
		sensitivity: 0.01,
	},
	pan: {
		sensitivity: 1.5,
	},
	scroll: {
		sensitivity: 0.1,
	},
	grid: {
		enabled: true,
		step: 1,
		line_width: 2,
		min_scale: 5,
	},
};

export default Settings;
