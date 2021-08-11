import Adjective from './../utils/adjectives';
import Animal from './../utils/animals';
import Color from './../utils/colors';

import { generateID } from '../utils/utils';

const id = generateID();

console.log(Adjective + ' ' + Animal, id);

export default {
	user_id: id,
	user_name: Adjective + ' ' + Animal,
	user_color: Color,

	line_width: 2,

	box_size: 8,
	highlight: '#1a83ee',

	max_zoom: 500,
	min_zoom: 0.0001,
	pan_sensitivity: 1.5,
	zoom_sensitivity: 0.01,

	grid_enabled: true,
	grid_step: 1,
	grid_line_width: 2,
	grid_min_scale: 5,
};
