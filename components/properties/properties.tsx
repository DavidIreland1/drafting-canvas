import { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/store';
import Dimensions from './dimensions';
import Fill from './fill';

export default function Properties({ store, actions }) {
	const [width, setWidth] = useState('max(20vw, 200px)');
	function resize(event) {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		const move = (move_event) => setWidth(window.innerWidth - move_event.clientX + 'px');
		event.target.addEventListener('pointermove', move);
		const end = () => {
			event.target.releasePointerCapture(event.pointerId);
			event.target.removeEventListener('pointermove', move);
		};
		event.target.addEventListener('pointerup', end, { once: true });
	}

	const selected = useSelector((state: RootState) => state.elements.filter((element) => element.selected));

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
					<Fill selected={selected} store={store} actions={actions} width={width} />
				</div>
			) : null}

			{styles}

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
