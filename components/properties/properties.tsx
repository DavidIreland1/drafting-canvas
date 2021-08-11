import { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/store';
import Dimensions from './dimensions';
import Fill from './fill';
import Stroke from './stroke';

export default function Properties({ store, actions, setPicker }) {
	const [width, setWidth] = useState('max(20vw, 200px)');

	function resize(event) {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		const move = (move_event) => setWidth(Math.max(window.innerWidth - move_event.clientX, 3) + 'px');
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
			h4.property-heading {
				margin: 10px 15px 8px 15px;
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
					<Fill selected={selected} store={store} actions={actions} width={width} setPicker={setPicker} />
					<div className="divider" />
					<Stroke selected={selected} store={store} actions={actions} width={width} setPicker={setPicker} />
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
					padding: 0 0 0 20px;
					display: grid;
					grid-template-columns: max-content 1fr max-content;
					gap: 10px;
				}
				.property-minus {
					width: 1em;
					height: 1em;
					margin: auto;
					padding: 6px;
					border-radius: 6px;
				}
				.property-minus  svg,
					width: 1em;
					height: 1em;
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
