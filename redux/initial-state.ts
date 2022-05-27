import { initial_page_color } from '../utils/initial-theme';

const initial_state = {
	cursors: [],
	views: [],
	elements: [],
	page: {
		color: initial_page_color,
		format: 'hex4',
		visible: true,
	},
};

export default initial_state;
