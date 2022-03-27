import { useState } from 'react';

export default function Select({ id, value, onChange, children }) {
	const [_value, setValue] = useState(value);

	const updateValue = (event) => {
		event.target.id = id;
		onChange(event);
		setValue(event.target.value);
	};

	return (
		<>
			<div id={id} className="container">
				<select value={_value} onChange={updateValue}>
					{children}
				</select>
				<svg viewBox="0 0 10 10">
					<path d="M 2 4 L 5 7 L 8 4" />
				</svg>
			</div>

			<style jsx>{`
				.container {
					border-bottom: 1px solid transparent;
					position: relative;
					height: 30px;
					box-sizing: border-box;
				}
				.container:hover {
					background: var(--hover);
				}
				.container:focus-within {
					background: var(--hover);
					border-bottom: 1px solid white;
				}
				select {
					padding: 5px 30px 5px 0;
					color: var(--text);
					border: 0;
					font-size: inherit;
					font-weight: inherit;
					font-family: inherit;
					background: transparent;
					width: 100%;
				}
				select:focus {
					outline: none;
				}
				select {
					-webkit-appearance: none;
					-moz-appearance: none;
					text-indent: 1px;
					text-overflow: '';
				}
				svg {
					height: 30px;
					position: absolute;
					top: 0;
					right: 0;
					stroke: white;
					stroke-width: 1px;
					box-sizing: border-box;
					padding: 8px;
					pointer-events: none;
				}
			`}</style>
		</>
	);
}
