import { useRef, useState } from 'react';

export default function Select({ id, label, value, onChange, children }) {
	if (value === undefined) return null;

	const input = useRef(null);
	const [_value, setValue] = useState(value);

	const updateValue = (event) => {
		event.target.id = id;
		onChange(event);
		setValue(event.target.value);
	};

	return (
		<>
			<div id={id} className="container">
				<label htmlFor="label">{label}</label>
				<select id="label" ref={input} value={_value} onChange={updateValue}>
					{children}
				</select>
			</div>

			<style jsx>{`
				.container {
					display: grid;
					grid-template-columns: auto 1fr;
					padding: 5px 0;
					border-bottom: 1px solid transparent;
				}
				.container:hover {
					background: var(--hover);
				}
				.container:focus-within {
					background: var(--hover);
					border-bottom: 1px solid white;
				}

				select {
					color: white;
					border: 0;
					font-size: inherit;
					font-weight: inherit;
					font-family: inherit;
					background: transparent;
				}
				select:focus {
					outline: none;
				}
			`}</style>
		</>
	);
}
