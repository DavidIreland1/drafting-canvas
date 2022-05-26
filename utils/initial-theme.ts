export let theme_default = 'dark';
if (typeof window !== 'undefined') {
	const theme_media = window.matchMedia('(prefers-color-scheme: dark)');
	theme_default = localStorage.getItem('theme') ?? (theme_media.matches ? 'dark' : 'light');
}

export const initial_page_color = theme_default === 'dark' ? [0.7, 0, 0.2, 1] : [1, 0, 0.9, 1];
