import { useEffect, useState } from 'react';

export default function Theme() {
	function toggleTheme() {
		const theme = document.getElementsByTagName('html')[0].classList.toggle('light') ? 'light' : 'dark';
		localStorage.setItem('drafting-canvas-theme', theme);
		setTheme(theme);
	}

	const [theme, setTheme] = useState('light');
	const [transition_duration, setTransitionDuration] = useState('');

	useEffect(() => {
		const theme = localStorage.getItem('drafting-canvas-theme');
		if (typeof theme === 'string') setTheme(theme);
		if (theme === 'light') document.getElementsByTagName('html')[0].classList.add(theme);
		setTimeout(() => {
			setTransitionDuration('500ms');
		}, 100);
	}, []);

	return (
		<div onClick={toggleTheme}>
			<input type="checkbox" checked={theme === 'light'} onChange={() => {}} />

			<style jsx>{`
				div {
					margin: 8px 3px auto 3px;
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
