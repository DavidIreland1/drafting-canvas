import { useRef } from 'react';

export default function Text({ id = undefined, placeholder = undefined, onChange, children }) {
	const input = useRef(null);

	function updateValue(event) {
		event.target.id = id;
		onChange(event);
	}

	return (
		<>
			<input id={id} ref={input} placeholder={placeholder} onChange={updateValue} value={String(children || '')} />

			<style jsx>{`
				input {
					background: transparent;
					border: none;
					color: var(--text-color);
					font-size: 16px;
					width: 100%;
				}
				input:focus {
					outline: none;
				}

				input:hover {
					background: var(--hover);
				}
				input:focus-within {
					background: var(--hover);
					border-bottom: 1px solid white;
				}
			`}</style>
		</>
	);
}
