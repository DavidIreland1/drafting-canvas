import { useEffect, useState } from 'react';
import { theme_default } from '../../utils/initial-theme';
import actions from '../../redux/slice';

export default function Theme({ store }) {
	const [theme, setTheme] = useState(theme_default);
	const [transition_duration, setTransitionDuration] = useState('');

	useEffect(() => {
		const theme_media = window.matchMedia('(prefers-color-scheme: dark)');
		setTheme(theme_default);
		if (theme_default === 'light') document.getElementsByTagName('html')[0].classList.add(theme_default);
		setTimeout(() => {
			setTransitionDuration('500ms');
		}, 100);

		theme_media.addEventListener('change', (event) => {
			const theme_changed = event.matches ? 'dark' : 'light';
			setTheme(theme_changed);
			document.getElementsByTagName('html')[0].classList.add(theme_changed);
		});
	}, []);

	function toggleTheme() {
		const new_theme = document.getElementsByTagName('html')[0].classList.toggle('light') ? 'light' : 'dark';
		localStorage.setItem('theme', new_theme);
		setTheme(new_theme);
		const page = store.getState().present.page;
		if (page.format === 'hex4' && (JSON.stringify(page.color) === JSON.stringify([0.7, 0, 0.2, 1]) || JSON.stringify(page.color) === JSON.stringify([1, 0, 0.9, 1]))) {
			store.dispatch(
				actions.setBackground({
					color: new_theme === 'dark' ? [0.7, 0, 0.2, 1] : [1, 0, 0.9, 1],
					format: 'hex4',
				})
			);
		}
	}

	return (
		<div onClick={toggleTheme}>
			<label htmlFor="theme">Theme Toggle</label>
			<input id="theme" type="checkbox" checked={theme === 'light'} onChange={() => null} />

			<style jsx>{`
				div {
					margin: 8px 3px auto 3px;
				}
				label {
					display: none;
				}
				input {
					margin: auto;
					--size: 24px;
					appearance: none;
					width: var(--size);
					height: var(--size);
					box-shadow: inset calc(var(--size) * 0.23) calc(var(--size) * -0.25) 0;
					transform: rotate(-90deg);
					border-radius: var(--size);
					color: var(--text);
					transition-property: transform, box-shadow;
					transition-duration: ${transition_duration};
					opacity: 0.8;
				}
				div:hover > input {
					opacity: 1;
				}
				input:checked {
					--ray-size: calc(var(--size) * -0.4);
					--offset-orthogonal: calc(var(--size) * 0.85);
					--offset-diagonal: calc(var(--size) * 0.55);
					transform: scale(0.5);
					color: var(--text);
					box-shadow: inset 0 0 0 var(--size), calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size), var(--offset-orthogonal) 0 0 var(--ray-size), 0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size), 0 var(--offset-orthogonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size), var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size),
						calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size), var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
				}
			`}</style>
		</div>
	);
}
