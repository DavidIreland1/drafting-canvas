import { useRef, useState } from 'react';

export default function Input({ id, label, value, type = 'number', step = 1, min = NaN, unit = '', onChange }) {
	const input = useRef(null);
	const [cursor, setCursor] = useState({ x: 0, y: 0 });

	if (value === undefined) return null;

	const updateValue = (event) => {
		event.target.id = id;
		event.target.last = value;
		onChange(event);
	};

	const dragProperty = (down_event) => {
		down_event.preventDefault();
		down_event.target.requestPointerLock();

		const scrub_cursor = document.getElementById('scrub-cursor');
		scrub_cursor.style.display = 'block';
		scrub_cursor.style.top = down_event.clientY + 'px';
		scrub_cursor.style.left = down_event.clientX + 'px';

		input.current.focus();
		const move = (move_event) => {
			move_event.preventDefault();

			const bounds = scrub_cursor.getBoundingClientRect();
			const y = (bounds.y + move_event.movementY) % window.innerHeight;
			const x = (bounds.x + move_event.movementX) % window.innerWidth;
			scrub_cursor.style.top = (y > 0 ? y : window.innerHeight) + 'px';
			scrub_cursor.style.left = (x > 0 ? x : window.innerWidth) + 'px';

			const delta = move_event.movementX * step;
			setCursor({ x: cursor.x + move_event.movementX, y: cursor.y + move_event.movementY });

			value = Number(value);
			if (isNaN(value)) value = 0;
			value = (delta + value).toPrecision(12); // Stops floating point errors
			move_event.target.value = isNaN(min) ? value : Math.max(value, min);
			move_event.target.id = id;
			onChange(move_event);
			if (move_event.stopPropagation) move_event.stopPropagation();
			if (move_event.preventDefault) move_event.preventDefault();
			move_event.cancelBubble = true;
			move_event.returnValue = false;
			return false;
		};
		down_event.target.addEventListener('mousemove', move);
		const end = () => {
			document.exitPointerLock();
			down_event.target.removeEventListener('mousemove', move);
			scrub_cursor.style.display = 'none';
		};
		down_event.target.addEventListener('mouseup', end, { once: true });
	};

	// Round to min(user set precision, 2dp)
	if (!isNaN(value)) {
		const length = Math.min(('.' + Math.abs(value).toPrecision(12).split('.')[1]).replaceAll('0', ' ').trim().length - 1, 2);
		value = value.toFixed(length);
	}

	return (
		<>
			<div id={id} className="dimension">
				<label onMouseDown={dragProperty}>{label}</label>
				<input ref={input} type={isNaN(value) ? '' : type} step={step} value={value} min={isNaN(min) ? undefined : min} onChange={updateValue} />
			</div>

			<style jsx>{`
				.dimension {
					display: grid;
					grid-template-columns: auto 1fr;
					padding: 5px 5px 5px 0;
					border-bottom: 1px solid transparent;
					color: var(--text);
				}
				.dimension:hover {
					background: var(--hover);
				}
				.dimension:focus-within {
					background: var(--hover);
					border-bottom: 1px solid white;
				}
				label {
					padding: 0 5px;
					cursor: ew-resize;
				}
				input {
					background: transparent;
					border: none;
					font-weight: inherit;
					font-family: inherit;
					min-width: max(100%, 4ch);
					font-size: 16px;
					text-align: right;
					font-weight: inherit;
					-moz-appearance: textfield;
					color: var(--text);
				}
				input:hover {
					-moz-appearance: unset;
				}
				input:focus {
					outline: none;
				}
				input::after {
					content: '${unit}';
				}
				input::-webkit-inner-spin-button,
				input::-webkit-outer-spin-button {
					opacity: 0;
				}
				input:hover::-webkit-inner-spin-button,
				input:hover::-webkit-outer-spin-button {
					opacity: 1;
				}
			`}</style>
		</>
	);
}
