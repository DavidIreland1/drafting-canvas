export default function Dimensions({ selected, store, actions, width }) {
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
			const delta_x = move_event.clientX - last_event.clientX;

			store.dispatch(actions.propertyRelative({ [down_event.target.parentNode.id]: (delta_x * (input.step || 1)) / (input.getAttribute('data-scale') || 1) }));
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
			<h4 className="property-heading">DIMENSIONS</h4>
			<div id="properties">
				{selected[0].x !== undefined ? (
					<div id="x" className="dimension">
						<label onPointerDown={dragProperty}>X</label>
						<input type="number" value={selected[0].x} onChange={updateProperty} />
					</div>
				) : null}
				{selected[0].y !== undefined ? (
					<div id="y" className="dimension">
						<label onPointerDown={dragProperty}>Y</label>
						<input type="number" value={selected[0].y} onChange={updateProperty} />
					</div>
				) : null}
				{selected[0].width !== undefined ? (
					<div id="width" className="dimension">
						<label onPointerDown={dragProperty}>W</label>
						<input type="number" value={selected[0].width} onChange={updateProperty} />
					</div>
				) : null}
				{selected[0].height !== undefined ? (
					<div id="height" className="dimension">
						<label onPointerDown={dragProperty}>H</label>
						<input type="number" value={selected[0].height} onChange={updateProperty} />
					</div>
				) : null}
				{selected[0].rotation !== undefined ? (
					<div id="rotation" className="dimension">
						<label onPointerDown={dragProperty} style={{ fontSize: '30px', lineHeight: '12px', padding: '0 5px 0 7px' }}>
							⊾
						</label>
						<input step="0.01" data-scale={57.2958} type="number" value={selected[0].rotation * 57.2958} onChange={updateProperty} />
					</div>
				) : null}
				{selected[0].border_raduis !== undefined ? (
					<div id="border_raduis" className="dimension">
						<label onPointerDown={dragProperty} style={{ fontSize: '24px', lineHeight: '10px', padding: '0px 8px 0px 0px' }}>
							╭
						</label>
						<input type="number" value={selected[0].border_raduis} onChange={updateProperty} />
					</div>
				) : null}
			</div>
			<style jsx>{`
				#properties {
					display: grid;
					grid-template-columns: auto auto;
					gap: 8px calc(${width} / 10);
					height: min-content;
					width: fit-content;
					margin: 0 auto 0 auto;
					overflow: hidden;
				}

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
					font-size: 16px;
					cursor: ew-resize;
				}
				input {
					background: transparent;
					border: none;
					max-width: calc(${width} / 2 - 20px);
					width: max(calc(${width} / 6), 5ch);
					min-width: 100%;
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
