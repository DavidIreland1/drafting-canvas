import { useEffect, useRef } from 'react';

export default function Text({ id = undefined, placeholder = undefined, highlight = false, className = undefined, onChange = undefined, onBlur = undefined, children = undefined }) {
	const input = useRef(null);

	function updateValue(event) {
		event.target.id = id;
		onChange(event);
	}

	useEffect(() => {
		if (highlight) input.current.select();
	}, [highlight]);

	return (
		<>
			<input id={id} ref={input} className={className} placeholder={placeholder} onChange={updateValue} onBlur={onBlur} value={String(children || '')} />

			<style jsx>{`
				input {
					background-color: transparent;
					border: none;
					color: var(--text);
					font-size: 16px;
					width: 100%;
					font-family: inherit;
					font-weight: inherit;
				}
				input:focus {
					outline: none;
				}

				input:hover {
					background-color: var(--hover);
				}
				input:focus-within {
					background-color: var(--hover);
					border-bottom: 1px solid white;
				}

				input.invalid {
					background-color: var(--invalid);
				}
			`}</style>
		</>
	);
}
