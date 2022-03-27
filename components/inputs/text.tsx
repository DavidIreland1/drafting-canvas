import { useRef } from 'react';

export default function Text({ id = undefined, placeholder = undefined, className = undefined, onChange = undefined, children = undefined }) {
	const input = useRef(null);

	function updateValue(event) {
		event.target.id = id;
		onChange(event);
	}

	return (
		<>
			<input id={id} ref={input} className={className} placeholder={placeholder} onChange={updateValue} value={String(children || '')} />

			<style jsx>{`
				input {
					background: transparent;
					border: none;
					color: var(--text);
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

				input.invalid {
					background: var(--invalid);
				}
			`}</style>
		</>
	);
}
