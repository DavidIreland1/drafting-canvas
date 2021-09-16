import Picker from '../picker';
import Elements from '../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';
import Select from './select';

export default function Fill({ selected, store, actions, width, setPicker }) {
	function addFill() {
		store.dispatch(actions.addFill({ id: generateID(), type: 'Solid', color: [0, 0, 0, 1], visible: true }));
	}

	function removeFill(fill) {
		store.dispatch(actions.removeFill({ id: fill.id }));
	}

	function toggleFill(fill) {
		store.dispatch(actions.setFill({ id: fill.id, visible: !fill.visible }));
	}

	function openPicker(event, fill) {
		const setProperty = (fill) => {
			store.dispatch(actions.setFill(fill));
		};
		function setType(event) {
			setProperty({ ...fill, type: event.target.value });
		}
		setPicker(
			<Picker setProperty={setProperty} prop_type="fill" prop_id={fill.id} event={event} setPicker={setPicker}>
				<Select id="type" label="" value={fill.type} onChange={setType}>
					<option id="Solid">Solid</option>
					<option id="Image">Image</option>
				</Select>
			</Picker>
		);
	}

	function getFills(selected) {
		return selected.map((element) => Elements[element.type].getFill(element)).flat();
	}

	function toFill(fill) {
		return (
			<div key={fill.id} className="property-row">
				<div className="property-color" onClick={(event) => openPicker(event, fill)} style={{ background: Colors.hslaToString(Colors.hsbaToHsla(fill.color)) }} />
				{Colors.rgbaToHex(fill.color)}

				<Eye open={fill.visible} onClick={() => toggleFill(fill)} />
				<Minus onClick={() => removeFill(fill)} />
			</div>
		);
	}

	return (
		<div id="property-container">
			<div className="property-heading" onClick={addFill}>
				<h4>FILL</h4>
				<Plus />
			</div>

			{getFills(selected).map(toFill)}

			<style jsx>{``}</style>
		</div>
	);
}
