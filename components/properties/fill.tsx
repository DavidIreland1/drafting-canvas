import { useState } from 'react';
import Picker from './picker';
import Elements from './../elements/elements';

export default function Fill({ selected, store, actions, width, setPicker }) {
	function addFill() {
		store.dispatch(actions.addFill({ color: 'blue' }));
	}

	function removeFill() {
		store.dispatch(actions.addFill({ color: 'blue' }));
	}

	function selectColor(event, color) {
		setPicker(<Picker store={store} actions={actions} from={color} event={event} setPicker={setPicker} />);
	}

	function toFill(fill, i) {
		return (
			<div key={i} className="property-row">
				<div className="property-color" onClick={(event) => selectColor(event, fill.color)} style={{ background: fill.color }} />
				{fill.color}

				<div className="property-minus" onClick={removeFill}>
					<svg viewBox="0 0 10 10" stroke="white" strokeWidth="1">
						<line x1="0" y1="5" x2="10" y2="5" />
					</svg>
				</div>
			</div>
		);
	}

	function dedup(selected) {
		return [...new Set(selected.map((element) => Elements[element.type].getFill(element)).flat())];
	}

	return (
		<div id="property-container">
			<div className="row">
				<h4 className="property-heading">FILL</h4>
				<div className="plus" onClick={addFill}>
					<svg viewBox="0 0 10 10" stroke="white" strokeWidth="1">
						<line x1="5" y1="0" x2="5" y2="10" />
						<line x1="0" y1="5" x2="10" y2="5" />
					</svg>
				</div>
			</div>

			{dedup(selected).map(toFill)}

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
