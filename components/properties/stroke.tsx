import { useState } from 'react';
import Picker from './picker';
import Elements from './../elements/elements';

export default function Stroke({ selected, store, actions, width, setPicker }) {
	function addStroke() {
		store.dispatch(actions.addStroke({ width: 4, color: 'blue' }));
	}

	function removeStroke() {
		store.dispatch(actions.addStroke({ color: 'blue' }));
	}

	function selectColor(event, color) {
		setPicker(<Picker store={store} actions={actions} from={color} event={event} setPicker={setPicker} />);
	}

	function toStroke(stroke, i) {
		return (
			<div key={i} className="property-row">
				<div className="property-color" onClick={(event) => selectColor(event, stroke.color)} style={{ background: stroke.color }} />
				{stroke.color}

				<div className="property-minus" onClick={removeStroke}>
					<svg viewBox="0 0 10 10" stroke="white" strokeWidth="1">
						<line x1="0" y1="5" x2="10" y2="5" />
					</svg>
				</div>
			</div>
		);
	}

	function dedup(selected) {
		return [...new Set(selected.map((element) => Elements[element.type].getStroke(element)).flat())];
	}

	return (
		<div id="property-container">
			<div className="row">
				<h4 className="property-heading">STROKE</h4>
				<div className="plus" onClick={addStroke}>
					<svg viewBox="0 0 10 10" stroke="white" strokeWidth="1">
						<line x1="5" y1="0" x2="5" y2="10" />
						<line x1="0" y1="5" x2="10" y2="5" />
					</svg>
				</div>
			</div>

			{dedup(selected).map(toStroke)}

			<style jsx>{`
				.row {
					display: grid;
					grid-template-columns: 1fr min-content;
					gap: 10px calc(${width} / 10);
				}

				.plus {
					margin: auto;
					padding: 6px;
					border-radius: 6px;
				}
				.plus > svg {
					width: 1em;
					height: 1em;
				}
				.plus:hover {
					background: var(--hover);
				}
			`}</style>
		</div>
	);
}
