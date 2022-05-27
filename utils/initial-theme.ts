import Persistent from './persistent';

export let theme_default = 'dark';
if (typeof window !== 'undefined') {
	theme_default = Persistent.load('theme', '') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

export const dark_canvas = [0.7, 0, 0.1, 1];
export const light_canvas = [0.7, 0, 0.9, 1];

export const initial_page_color = theme_default === 'dark' ? dark_canvas : light_canvas;
