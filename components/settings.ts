import Adjective from './../utils/adjectives';
import Animal from './../utils/animals';
import Color from './../utils/colors';

const id = String(Math.random());
console.log(Adjective + ' ' + Animal, id);
export default {
	user_id: id,
	user_name: Adjective + ' ' + Animal,
	user_color: Color,

	line_width: 2,
	box_size: 8,
	highlight: '#1a83ee',

	max_zoom: 10,
	min_zoom: 0.0001,
	pan_sensitivity: 1.2,
	zoom_sensitivity: 0.01,

	grid_enabled: false,
	grid_step: 10,
	grid_line_width: 2,
	grid_min_scale: 0.8,
};
