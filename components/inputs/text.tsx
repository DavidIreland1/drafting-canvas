import { useEffect, useRef } from 'react';

export default function Text({ id = undefined, placeholder = undefined, highlight = false, className = undefined, onChange = undefined, onEnter = undefined, onBlur = undefined, children = undefined }) {
	const input = useRef(null);

	function updateValue(event) {
		event.target.id = id;
		onChange(event);
	}

	function checkEnter(event) {
		console.log(event);
		if (onEnter && event.key === 'Enter') onEnter(event);
	}

	useEffect(() => {
		if (highlight) input.current.select();
	}, [highlight]);

	return (
		<>
			<input id={id} ref={input} className={className} placeholder={placeholder} onChange={updateValue} onKeyPress={checkEnter} onBlur={onBlur} value={String(children || '')} />

			<style jsx>{`
				input {
					background: transparent;
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
