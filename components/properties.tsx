import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from './../redux/store';

export default function Properties(props) {
	const { user_id, store, actions } = props;

	// const [selected, setSelected] = useState([]);
	store.subscribe(() => {
		// setSelected(store.getState().elements.filter((element) => element.selected));
		// const state = store.getState();
		// console.log(state.elements.filter((element) => element.selected));
	});

	const selected = useSelector((state: RootState) => state.elements.filter((element) => element.selected));

	const [width, setWidth] = useState('max(20vw, 200px)');
	const resize = (event) => {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		const move = (move_event) => setWidth(window.innerWidth - move_event.clientX + 'px');
		event.target.addEventListener('pointermove', move);
		const end = () => {
			event.target.releasePointerCapture(event.pointerId);
			event.target.removeEventListener('pointermove', move);
		};
		event.target.addEventListener('pointerup', end, { once: true });
	};

	const updateProperty = (event) => {
		event.target.style.minWidth = Math.max(event.target.value.length + 2, 5) + 'ch';
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
		<div id="container">
			<div id="handle" onPointerDown={resize}></div>

			{selected.length ? (
				<div id="properties">
					<div id="x" className="row">
						<label onPointerDown={dragProperty}>X</label>
						<input type="number" value={selected[0].x} onChange={updateProperty} />
					</div>
					<div id="y" className="row">
						<label onPointerDown={dragProperty}>Y</label>
						<input type="number" value={selected[0].y} onChange={updateProperty} />
					</div>
					<div id="width" className="row">
						<label onPointerDown={dragProperty}>W</label>
						<input type="number" value={selected[0].width} onChange={updateProperty} />
					</div>
					<div id="height" className="row">
						<label onPointerDown={dragProperty}>H</label>
						<input type="number" value={selected[0].height} onChange={updateProperty} />
					</div>
					<div id="rotation" className="row">
						<label onPointerDown={dragProperty} style={{ fontSize: '30px', lineHeight: '12px', padding: '0 5px 0 7px' }}>
							⊾
						</label>
						<input step="0.01" data-scale={57.2958} type="number" value={selected[0].rotation * 57.2958} onChange={updateProperty} />
					</div>
					<div id="border_raduis" className="row">
						<label onPointerDown={dragProperty} style={{ fontSize: '24px', lineHeight: '10px', padding: '0px 8px 0px 0px' }}>
							╭
						</label>
						<input type="number" value={selected[0].border_raduis} onChange={updateProperty} />
					</div>
				</div>
			) : (
				''
			)}

			<style jsx>{`
				#properties {
					display: grid;
					grid-template-columns: 1fr 1fr;
					grid-gap: 5px;
					height: min-content;
					width: min-content;
					padding: 20px 0;
					margin: 0 auto 0 auto;
				}
				.row {
					display: grid;
					grid-template-columns: auto 1fr;
					padding: 5px 0;
					border-bottom: 1px solid transparent;
				}
				.row:hover {
					background: var(--hover);
				}
				.row:focus-within {
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
					width: 100%;
					min-width: 5ch;
					color: var(--text-color);
					font-size: 16px;
					text-align: right;
				}

				input:focus {
					outline: none;
				}

				#container {
					color: var(--text-color);
					width: ${width};
					background: var(--panel);
					position: absolute;
					display: grid;
					height: 100%;
					right: 0;
				}
				#handle {
					position: absolute;
					height: 100%;
					width: 6px;
					background: transparent;
					left: -3px;
					cursor: ew-resize;
				}
			`}</style>
		</div>
	);
}
