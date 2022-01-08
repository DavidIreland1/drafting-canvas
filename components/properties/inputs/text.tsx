import { useRef } from 'react';

export default function Input({ id = undefined, placeholder = undefined, onChange, children }) {
	// if (value === undefined) return null;

	const input = useRef(null);

	function updateValue(event) {
		console.log(event);
		event.target.id = id;
		onChange(event);
	}

	return (
		<>
			<input id={id} className="input" ref={input} placeholder={placeholder} onChange={updateValue} value={String(children)}></input>

			<style jsx>{`
				.input {
					background: transparent;
					border: none;
					color: var(--text-color);
					font-size: 16px;
					width: 100%;
				}
				.input:focus {
					outline: none;
				}

				.input:hover {
					background: var(--hover);
				}
				.input:focus-within {
					background: var(--hover);
					border-bottom: 1px solid white;
				}
			`}</style>
		</>
	);
}
