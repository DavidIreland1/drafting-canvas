import { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/store';
import Background from './background';
import Dimensions from './dimensions';
import Fill from './fill';
import Stroke from './stroke';
import Effects from './effects';
import Text from './text';

export default function Properties({ store, actions, setPicker, fonts, onResize }) {
	const [width, setWidth] = useState('max(20vw, 150px)');
	const selected = useSelector(
		(state: RootState) => state.present.elements.filter((element) => element.selected),
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);
	// const selected = [];

	function resize(event) {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		// const move = (move_event) => setWidth(Math.max(window.innerWidth - move_event.clientX, 3) + 'px');
		const move = (move_event) => {
			setWidth(`max(${((window.innerWidth - move_event.clientX) / window.innerWidth) * 100}vw, 3px)`);
			onResize();
		};
		event.target.addEventListener('pointermove', move);
		const end = () => {
			event.target.releasePointerCapture(event.pointerId);
			event.target.removeEventListener('pointermove', move);
		};
		event.target.addEventListener('pointerup', end, { once: true });
	}

	return (
		<div id="container" style={{ width: width }}>
			<div id="handle" onPointerDown={resize}></div>

			{selected.length === 0 ? (
				<Background store={store} actions={actions} setPicker={setPicker}></Background>
			) : (
				<div>
					<Dimensions selected={selected} store={store} actions={actions} width={width} />
					<div className="divider" />
					<Text selected={selected} store={store} actions={actions} width={width} fonts={fonts} />
					<Fill selected={selected} store={store} actions={actions} setPicker={setPicker} />
					<div className="divider" />
					<Stroke selected={selected} store={store} actions={actions} setPicker={setPicker} />
					<div className="divider" />
					<Effects selected={selected} store={store} actions={actions} setPicker={setPicker} />
				</div>
			)}

			<style>{`
				.property-container {
					padding: 10px 0;
				}
				.property-heading {
					display: grid;
					grid-template-columns: 1fr 30px;
					padding: 0 10px 5px 10px;
					gap: 5px;
				}
				h4 {
					cursor: default;
					margin: 0;
					padding: 5px 0;
					font-weight: 300;
				}
			`}</style>

			<style>{`

				.checker-background {
					margin: auto;
					width: 1.5em;
					height: 1.5em;
					white: white;
					background-color: lightgrey;
					background-image: linear-gradient(45deg, white 25%, transparent 0%, transparent 75%, white 75%), linear-gradient(45deg, white 25%, transparent 0%, transparent 75%, white 75%);
					background-position: 0 0, 0.3em 0.3em;
					background-size: calc(0.3em * 2) calc(0.3em * 2);
				}
				.property-color {
					position: absolute;
					width: 1.5em;
					height: 1.5em;
				}
				.property-row {
					padding: 0 10px 0 5px;
					display: grid;
					grid-template-columns: min-content max-content 1fr 30px 30px;
					gap: 5px;
					line-height: 28px;
				}
				.property-minus {
					width: 100%;
					height: 100%;
					margin: auto;
					border-radius: 6px;
				}
				.property-minus  svg,
					height: 100%;
					width: 100%;
				}
				.property-minus:hover {
					background: var(--hover);
				}
			`}</style>

			<style jsx>{`
				#container {
					color: var(--text-color);
					background: var(--panel);
					position: relative;
					display: grid;
					height: 100%;
					right: 0;
					padding: 10px 0;
					overflow-x: hidden;
				}
				#handle {
					position: absolute;
					height: 100%;
					width: 6px;
					background: transparent;
					left: -3px;
					cursor: ew-resize;
				}
				.divider {
					height: 2px;
					background: var(--selected);
					margin: 10px 0;
				}
			`}</style>
		</div>
	);
}
