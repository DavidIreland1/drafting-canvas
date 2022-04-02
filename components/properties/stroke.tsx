import Picker from '../picker';
import Elements, { flatten } from '../elements/elements';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Input from '../inputs/input';
import Select from '../inputs/select';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';
import Text from '../inputs/text';
import { useEffect, useState } from 'react';
import actions from '../../redux/slice';

export default function Stroke({ selected, store, setPicker }) {
	const selected_ids = selected.map((element) => element.id);

	const strokes = selected.map((element) => Elements[element.type].getStroke(element)).flat();

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>STROKE</h4>
				<Plus onClick={() => addStroke(selected_ids, store)} />
			</div>

			{strokes.map((stroke) => (
				<StrokeInput key={stroke.id} stroke={stroke} setPicker={setPicker} selected_ids={selected_ids} store={store} />
			))}
		</div>
	);
}

function addStroke(selected_ids, store) {
	store.dispatch(actions.addStroke({ selected_ids, props: { id: generateID(), type: 'Center', width: 10, color: [0.7, 0.5, 1, 1], format: 'hex4', visible: true } }));
}

function removeStroke(stroke, store) {
	store.dispatch(actions.removeStroke({ id: stroke.id }));
}

function toggleStroke(stroke, selected_ids, store) {
	store.dispatch(actions.setStroke({ selected_ids, props: { id: stroke.id, visible: !stroke.visible } }));
}

function openPicker(event, stroke, setPicker, selected_ids, store) {
	const setProperty = (stroke) => {
		store.dispatch(actions.setStroke({ selected_ids, props: stroke }));
	};

	const selector = (state) => {
		return flatten(state.present.elements)
			.filter((element) => element.type !== 'group' && element.selected)
			.map((element) => element.stroke)
			.flat()
			.find((prop) => prop.id === stroke.id);
	};
	setPicker(
		<Picker setProperty={setProperty} selector={selector} event={event} setPicker={setPicker}>
			<Select id="type" value={stroke.type} onChange={(event) => setProperty({ ...stroke, type: event.target.value })}>
				<option value="Inner">Inner</option>
				<option value="Center">Center</option>
				<option value="Outer">Outer</option>
			</Select>
		</Picker>
	);
}

function changeWidth(event, stroke, selected_ids, store) {
	store.dispatch(actions.setStroke({ selected_ids, props: { id: stroke.id, width: Number(event.target.value) } }));
}

function changeType(event, stroke, selected_ids, store) {
	store.dispatch(actions.setStroke({ selected_ids, props: { id: stroke.id, type: event.target.value } }));
}

function StrokeInput({ stroke, setPicker, selected_ids, store }) {
	const color_string = Colors.toString(stroke.color, stroke.format);
	const [color, setColor] = useState(color_string);
	useEffect(() => setColor(color_string), [color_string]);

	function changeColor(event) {
		const new_color = event.target.value;
		setColor(new_color);
		if (Colors.isValid(new_color)) {
			store.dispatch(
				actions.setStroke({
					selected_ids,
					props: {
						...stroke,
						color: Colors.hslaToHsba(Colors.rgbaToHsla(Colors.stringToRgba(new_color))),
						format: Colors.getFormat(new_color),
					},
				})
			);
		}
	}

	return (
		<div key={stroke.id}>
			<div className="property-row">
				<div>::</div>
				<div className="checker-background">
					<div className="property-color" onClick={(event) => openPicker(event, stroke, setPicker, selected_ids, store)} style={{ background: Colors.toString(stroke.color) }} />
				</div>

				<Text placeholder="Color" className={Colors.isValid(color) || 'invalid'} onChange={changeColor}>
					{color}
				</Text>

				<Eye open={stroke.visible} onClick={() => toggleStroke(stroke, selected_ids, store)} />
				<Minus onClick={() => removeStroke(stroke, store)} />
			</div>
			<div className="grid">
				<Input id="width" label="W" value={stroke.width} min={0} step={0.1} onChange={(event) => changeWidth(event, stroke, selected_ids, store)} />
				<Select id="type" value={stroke.type} onChange={(event) => changeType(event, stroke, selected_ids, store)}>
					<option value="Inside">Inside</option>
					<option value="Center">Center</option>
					<option value="Outside">Outside</option>
				</Select>
			</div>

			<style jsx>{`
				.grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 10px;
					padding: 0 10px;
				}
			`}</style>
		</div>
	);
}
