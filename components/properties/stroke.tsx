import Picker from '../picker';
import Elements, { flatten } from '../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Input from './inputs/input';
import Select from './inputs/select';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';
import Text from './inputs/text';

export default function Stroke({ selected, store, actions, setPicker, width }) {
	const selected_ids = selected.map((element) => element.id);

	function addStroke() {
		store.dispatch(actions.addStroke({ selected_ids, props: { id: generateID(), type: 'Center', width: 1, color: [0.5, 0.5, 1, 1], visible: true } }));
	}

	function removeStroke(stroke) {
		store.dispatch(actions.removeStroke({ id: stroke.id }));
	}

	function toggleStroke(stroke) {
		store.dispatch(actions.setStroke({ selected_ids, props: { id: stroke.id, visible: !stroke.visible } }));
	}

	const setProperty = (stroke) => {
		store.dispatch(actions.setStroke({ selected_ids, props: stroke }));
	};

	function openPicker(event, stroke) {
		function setType(event) {
			setProperty({ ...stroke, type: event.target.value });
		}

		const selector = (state) => {
			return flatten(state.present.elements)
				.filter((element) => element.type !== 'group' && element.selected)
				.map((element) => element.stroke)
				.flat()
				.find((prop) => prop.id === stroke.id);
		};
		setPicker(
			<Picker setProperty={setProperty} selector={selector} event={event} setPicker={setPicker}>
				<Select id="type" label="" value={stroke.type} onChange={setType}>
					<option id="Inner">Inner</option>
					<option id="Center">Center</option>
					<option id="Outer">Outer</option>
				</Select>
			</Picker>
		);
	}

	function changeWidth(event, stroke) {
		store.dispatch(actions.setStroke({ selected_ids, props: { id: stroke.id, width: Number(event.target.value) } }));
	}

	function changeType(event, stroke) {
		store.dispatch(actions.setStroke({ selected_ids, props: { id: stroke.id, type: event.target.value } }));
	}

	function getStrokes(selected) {
		return selected.map((element) => Elements[element.type].getStroke(element)).flat();
	}

	function toStroke(stroke) {
		return (
			<div key={stroke.id}>
				<div className="property-row">
					<div>::</div>
					<div className="checker-background">
						<div className="property-color" onClick={(event) => openPicker(event, stroke)} style={{ background: Colors.hslaToString(Colors.hsbaToHsla(stroke.color)) }} />
					</div>
					<div>
						<Text id="color" placeholder="Color" onChange={console.log}>
							{Colors.rgbaToHex(stroke.color)}
						</Text>
					</div>

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
			<div className="property-heading">
				<h4>STROKE</h4>
				<Plus onClick={addStroke} />
			</div>

			{getStrokes(selected).map(toStroke)}
		</div>
	);
}
