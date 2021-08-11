export default function Input({ id, step = 1, selected, store, actions, width }) {
	if (selected[0][id] === undefined) return null;

	const updateProperty = (event) => {
		event.target.style.width = `max(calc(${width} / 6), ${Math.max(event.target.value.length + 2, 5)}ch)`;
		if (!Number.isNaN(event.target.value) || event.target.value === '') store.dispatch(actions.property({ [event.target.parentNode.id]: Number(event.target.value) }));
	};

	const dragProperty = (down_event) => {
		down_event.preventDefault();
		down_event.target.setPointerCapture(down_event.pointerId);

		const input = down_event.target.nextElementSibling;
		input.focus();
		let last_event = down_event;
		const move = (move_event) => {
			move_event.preventDefault();
			const delta = move_event.clientX - last_event.clientX;
			store.dispatch(actions.propertyRelative({ [down_event.target.parentNode.id]: Math.round(delta) * (input.step || 1) }));
			last_event = move_event;
		};
		down_event.target.addEventListener('pointermove', move);
		const end = () => {
			down_event.target.releasePointerCapture(down_event.pointerId);
			down_event.target.removeEventListener('pointermove', move);
		};
		down_event.target.addEventListener('pointerup', end, { once: true });
	};

	return (
		<div id="property-container">
			<div id={id} className="dimension">
				<label onPointerDown={dragProperty}>{id}</label>
				<input type="number" step={step} value={selected[0][id]} onChange={updateProperty} onClick={(event) => event.target.select()} />
			</div>

			<style jsx>{`
				.dimension {
					display: grid;
					grid-template-columns: 35px 1fr;
					padding: 5px 0;
					border-bottom: 1px solid transparent;
				}
				.dimension:hover {
					background: var(--hover);
				}
				.dimension:focus-within {
					background: var(--hover);
					border-bottom: 1px solid white;
				}
				label {
					padding: 0 10px;
					cursor: ew-resize;
					text-transform: uppercase;
					font-size: 0;
				}
				label:first-letter {
					font-size: 16px;
				}
				input {
					background: transparent;
					border: none;
					max-width: calc(${width} / 2 - 20px);
					width: max(calc(${width} / 6), 5ch);
					min-width: max(100%, 4ch);
					color: var(--text-color);
					font-size: 16px;
					text-align: right;
				}
				input:focus {
					outline: none;
				}
			`}</style>
		</div>
	);
}
