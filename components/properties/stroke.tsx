import Picker from './picker';
import Elements from './../elements/elements';
import { generateID } from '../../utils/utils';

export default function Stroke({ selected, store, actions, width, setPicker }) {
	function addStroke() {
		store.dispatch(actions.addStroke({ id: generateID(), width: 4, color: 'blue' }));
	}

	function removeStroke() {
		store.dispatch(actions.addStroke({ id: generateID(), color: 'blue' }));
	}

	function selectColor(event, color_id, color) {
		setPicker(<Picker store={store} actions={actions} color_id={color_id} color={color} event={event} setPicker={setPicker} />);
	}

	function toStroke(stroke) {
		return (
			<div key={stroke.id} className="property-row">
				<div className="property-color" onClick={(event) => selectColor(event, stroke.id, stroke.color)} style={{ background: stroke.color }} />
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
