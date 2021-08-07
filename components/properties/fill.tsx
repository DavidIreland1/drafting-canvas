import { useState } from 'react';
import Picker from './picker';

export default function Dimensions({ selected, store, actions, width }) {
	if (!selected[0].fill) return <div />;
	function addFill() {
		store.dispatch(actions.addFill({ color: 'blue' }));
	}

	const [picker, setPicker] = useState(null);

	function selectColor(event, color) {
		setPicker(<Picker store={store} actions={actions} from={color} event={event} />);
	}

	function toFill(fill, i) {
		return (
			<div key={i} className="fill">
				<div className="color" onClick={(event) => selectColor(event, fill.color)} style={{ background: fill.color }} />
				{fill.color}
			</div>
		);
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

			{selected[0].fill.map(toFill)}

			{picker}

			<style>{`
				.color {
					width: 1em;
					height: 1em;
					margin: auto;
				}

				.fill {
					padding: 10px 20px;
					display: grid;
					grid-template-columns: min-content 1fr;
					gap: 10px;
				}
			`}</style>

			<style jsx>{`
				.row {
					display: grid;
					grid-template-columns: 1fr min-content;
					gap: 10px calc(${width} / 10);
					margin: 10px;
				}

				.plus {
					margin: auto;
					padding: 6px;
					border-radius: 6px;
				}
				.plus > svg,
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
