import { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/store';
import Dimensions from './dimensions';
import Fill from './fill';
import Stroke from './stroke';
import Effects from './effects/effects';

export default function Properties({ store, actions, setPicker }) {
	const [width, setWidth] = useState('max(20vw, 230px)');

	function resize(event) {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		// const move = (move_event) => setWidth(Math.max(window.innerWidth - move_event.clientX, 3) + 'px');
		const move = (move_event) => setWidth(`max(${((window.innerWidth - move_event.clientX) / window.innerWidth) * 100}vw, 3px)`);
		event.target.addEventListener('pointermove', move);
		const end = () => {
			event.target.releasePointerCapture(event.pointerId);
			event.target.removeEventListener('pointermove', move);
		};
		event.target.addEventListener('pointerup', end, { once: true });
	}

	const selected = useSelector((state: RootState) => (state as any).present.elements.filter((element) => element.selected));

	const styles = (
		<style>{`
			.property-container {
				padding: 10px 0;
			}
			.property-heading {
				display: grid;
				grid-template-columns: 1fr 30px;
				padding: 0 10px 5px 10px;
				gap: 5px calc(${width} / 40);
			}
			h4 {
				cursor: default;
				margin: 0;
				padding: 5px 0;
				font-weight: 300;
			}
		`}</style>
	);

	return (
		<div id="container">
			<div id="handle" onPointerDown={resize}></div>

			{selected.length ? (
				<div>
					<Dimensions selected={selected} store={store} actions={actions} width={width} />
					<div className="divider" />
					<Fill selected={selected} store={store} actions={actions} setPicker={setPicker} />
					<div className="divider" />
					<Stroke selected={selected} store={store} actions={actions} setPicker={setPicker} width={width} />
					<div className="divider" />
					<Effects selected={selected} store={store} actions={actions} setPicker={setPicker} width={width} />
				</div>
			) : null}

			{styles}

			<style>{`
				.property-color {
					width: 1.5em;
					height: 1.5em;
					margin: auto;
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
					width: ${width};
					background: var(--panel);
					position: absolute;
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
