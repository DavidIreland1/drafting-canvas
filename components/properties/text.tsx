import { useRef } from 'react';

export default function Input({ id = undefined, placeholder = undefined, onChange, children }) {
	// if (value === undefined) return null;

	const input = useRef(null);

	const updateValue = (event) => {
		event.target.id = id;
		onChange(event);
	};

	return (
		<>
			<div id={id} className="input" ref={input} contentEditable={true} placeholder={placeholder} onChange={updateValue} suppressContentEditableWarning={true}>
				{String(children)}
			</div>

			<style jsx>{`
				.input {
					background: transparent;
					border: none;
					color: var(--text-color);
					font-size: 16px;
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
