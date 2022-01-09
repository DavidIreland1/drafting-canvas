import { useRef, useState } from 'react';

export default function DataList({ id, label, value, onChange, children }) {
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
				<input list="datalist" placeholder={label} defaultValue={value} onChange={updateValue} onMouseDown={(event) => ((event.target as HTMLInputElement).value = '')} />
				<datalist id="datalist" ref={input} onInput={console.log}>
					{children}
				</datalist>
			</div>

			<style jsx>{`
				.container {
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

				input {
					color: white;
					width: 100%;
					border: 0;
					font-size: inherit;
					font-weight: inherit;
					font-family: inherit;
					background: transparent;
				}
				input:focus {
					outline: none;
				}
			`}</style>
		</>
	);
}
