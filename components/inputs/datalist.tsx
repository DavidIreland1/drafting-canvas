import { useRef, useState } from 'react';

export default function DataList({ id, label, value, onChange, children }) {
	const input = useRef(null);
	const [_value, setValue] = useState(value);

	function updateValue(event) {
		event.target.id = id;
		onChange(event);
		setValue(event.target.value);
	}

	function mouseDown(event) {
		event.target.value = '';
	}

	return (
		<>
			<div id={id} className="container">
				<input list="datalist" placeholder={label} defaultValue={value} onChange={updateValue} onMouseDown={mouseDown} />
				<svg viewBox="0 0 10 10">
					<path d="M 2 4 L 5 7 L 8 4" />
				</svg>
				<datalist id="datalist" ref={input}>
					{children}
				</datalist>
			</div>

			<style jsx>{`
				.container {
					padding: 5px 0;
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
				input {
					color: var(--text);
					width: 100%;
					border: 0;
					font-size: inherit;
					font-weight: inherit;
					font-family: inherit;
					background: transparent;
					margin-bottom: 2px;
				}
				input:focus {
					outline: none;
				}
				input::-webkit-calendar-picker-indicator {
					opacity: 0;
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
