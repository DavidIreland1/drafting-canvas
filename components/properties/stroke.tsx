import Picker from '../picker';
import Elements from '../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Input from './input';
import Select from './select';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';

export default function Stroke({ selected, store, actions, width, setPicker }) {
	function addStroke() {
		store.dispatch(actions.addStroke({ id: generateID(), type: 'Center', width: 2, color: [0.5, 0.5, 1, 1], visible: true }));
	}

	function removeStroke(stroke) {
		store.dispatch(actions.removeStroke({ id: stroke.id }));
	}

	function toggleStroke(stroke) {
		store.dispatch(actions.setStroke({ id: stroke.id, visible: !stroke.visible }));
	}

	const setProperty = (stroke) => {
		store.dispatch(actions.setStroke(stroke));
	};

	function openPicker(event, stroke) {
		function setType(event) {
			setProperty({ ...stroke, type: event.target.value });
		}
		setPicker(
			<Picker setProperty={setProperty} prop_type="stroke" prop_id={stroke.id} event={event} setPicker={setPicker}>
				<Select id="type" label="" value={stroke.type} onChange={setType}>
					<option id="Inner">Inner</option>
					<option id="Center">Center</option>
					<option id="Outer">Outer</option>
				</Select>
			</Picker>
		);
	}

	function changeWidth(event, stroke) {
		store.dispatch(actions.setStroke({ id: stroke.id, width: Number(event.target.value) }));
	}

	function changeType(event, stroke) {
		store.dispatch(actions.setStroke({ id: stroke.id, type: event.target.value }));
	}

	function getStrokes(selected) {
		return selected.map((element) => Elements[element.type].getStroke(element)).flat();
	}

	function toStroke(stroke) {
		return (
			<div key={stroke.id}>
				<div className="property-row">
					<div className="property-color" onClick={(event) => openPicker(event, stroke)} style={{ background: Colors.hslaToString(Colors.hsbaToHsla(stroke.color)) }} />
					{Colors.rgbaToHex(stroke.color)}
					<Eye open={stroke.visible} onClick={() => toggleStroke(stroke)} />
					<Minus onClick={() => removeStroke(stroke)} />
				</div>
				<div className="grid">
					<Input id="width" label="W" value={stroke.width} min={0} step={0.1} onChange={(event) => changeWidth(event, stroke)} width={width}></Input>
					<Select id="trpe" label="" value={stroke.type} onChange={(event) => changeType(event, stroke)}>
						<option value="Inside">Inside</option>
						<option value="Center">Center</option>
						<option value="Outside">Outside</option>
					</Select>
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
			<div className="property-heading" onClick={addStroke}>
				<h4>STROKE</h4>
				<Plus />
			</div>

			{getStrokes(selected).map(toStroke)}
			<style jsx>{``}</style>
		</div>
	);
}
