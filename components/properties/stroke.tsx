import Picker from './picker';
import Elements from '../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Input from './input';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';

export default function Stroke({ selected, store, actions, width, setPicker }) {
	function addStroke() {
		store.dispatch(actions.addStroke({ id: generateID(), width: 2, color: [0, 0, 1, 1], visible: true }));
	}

	function removeStroke(id) {
		store.dispatch(actions.removeStroke({ id }));
	}

	function toggleStroke(id) {
		store.dispatch(actions.toggleStroke({ id }));
	}

	function selectColor(event, id, color) {
		setPicker(<Picker store={store} actions={actions} id={id} color={color} event={event} setPicker={setPicker} />);
	}

	function dedup(selected) {
		return [...new Set(selected.map((element) => Elements[element.type].getStroke(element)).flat())];
	}

	function changeWidth(id, event) {
		const value = Number(event.target.value);

		store.dispatch(actions.strokeWidth({ id, width: value }));
	}

	function toStroke(stroke) {
		return (
			<div key={stroke.id}>
				<div className="property-row">
					<div className="property-color" onClick={(event) => selectColor(event, stroke.id, stroke.color)} style={{ background: Colors.rgbaToString(stroke.color) }} />
					{Colors.rgbaToHex(stroke.color)}
					<Eye open={stroke.visible} onClick={() => toggleStroke(stroke.id)} />
					<Minus onClick={() => removeStroke(stroke.id)} />
				</div>
				<div className="grid">
					<Input id="width" label="W" value={stroke.width} min={0} step={0.1} onChange={(event) => changeWidth(stroke.id, event)} width={width}></Input>
				</div>

				<style jsx>{`
					.grid {
						display: grid;
						grid-template-columns: auto auto;
						padding: 0 10px;
					}
				`}</style>
			</div>
		);
	}

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>STROKE</h4>
				<Plus onClick={addStroke} />
			</div>

			{dedup(selected).map(toStroke)}
			<style jsx>{``}</style>
		</div>
	);
}
