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

	const [width, setWidth] = useState('15vw');
	const resize = (event) => {
		event.preventDefault();
		const move = (move_event) => setWidth(window.innerWidth - move_event.clientX + 'px');
		window.addEventListener('mousemove', move);
		window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
	};

	const updateX = (event) => {
		store.dispatch(actions.property({ x: event.target.value }));
	};

	return (
		<div id="container">
			<div id="handle" onMouseDown={resize}></div>

			{selected.length ? (
				<div id="properties">
					<div className="row">
						<label>X</label>
						<input type="number" value={selected[0].x} onChange={updateX} />
					</div>
					<div className="row">
						<label>Y</label>
						<input type="number" value={selected[0].y} onChange={(event) => store.dispatch(actions.property({ y: event.target.value }))} />
					</div>
					{/* <div className="row">
						<label>W</label>
						<input type="number" value={selected[0].width} onChange={(event) => store.dispatch(actions.property({ width: event.target.value }))} />
					</div>
					<div className="row">
						<label>H</label>
						<input type="number" value={selected[0].height} onChange={(event) => store.dispatch(actions.property({ height: event.target.value }))} />
					</div>
					<div className="row">
						<label style={{ fontSize: '30px', lineHeight: '12px', padding: '0 5px 0 7px' }}>⊾</label>
						<input type="number" value={selected[0].rotation} onChange={(event) => store.dispatch(actions.property({ rotation: event.target.value }))} />
					</div>
					<div className="row">
						<label style={{ fontSize: '24px', lineHeight: '10px', padding: '0px 8px 0px 0px' }}>╭</label>
						<input type="number" value={selected[0].border_raduis} onChange={(event) => store.dispatch(actions.property({ border_raduis: event.target.value }))} />
					</div> */}
				</div>
			) : (
				''
			)}

			<style jsx>{`
				#properties {
					display: grid;
					grid-template-columns: 1fr 1fr;
					grid-gap: 10px;
					height: min-content;
					padding: 20px 0;
					width: 80%;
					max-width: 400px;
					margin: 0 auto;
				}
				.row {
					display: grid;
					grid-template-columns: auto 1fr;
					grid-gap: 10px;
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
				}
				input {
					background: transparent;
					border: none;
					width: 100%;
					min-width: 50px;
					color: var(--text-color);
					font-size: 16px;
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
