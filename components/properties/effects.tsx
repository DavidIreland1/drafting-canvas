import Picker from '../picker';
import { generateID } from '../../utils/utils';
import Colors from './colors';
import Eye from '../icons/eye';
import Minus from '../icons/minus';
import Plus from '../icons/plus';
import Input from '../inputs/input';
import Text from '../inputs/text';
import Select from '../inputs/select';
import { useEffect, useState } from 'react';
import actions from '../../redux/slice';
import Elements, { flatten } from '../canvas/elements/elements';

export default function Effect({ selected, store, setPicker }) {
	const selected_ids = selected.map((element) => element.id);

	const effects = selected.map((element) => Elements[element.type].getEffect(element)).flat();

	return (
		<div className="property-container">
			<div className="property-heading">
				<h4>EFFECTS</h4>
				<Plus onClick={() => addEffect(selected_ids, store)} />
			</div>

			{effects.map((effect) => (
				<EffectInput key={effect.id} effect={effect} setPicker={setPicker} selected_ids={selected_ids} store={store} />
			))}
		</div>
	);
}

function addEffect(selected_ids, store) {
	store.dispatch(
		actions.addEffect({
			selected_ids,
			props: {
				id: generateID(),
				type: 'Drop shadow',
				// type: 'Inner shadow',
				x: 10,
				y: 10,
				blur: 20,
				spread: 0,
				color: [0, 0, 0, 0.6],
				format: 'hex4',
				visible: true,
			},
		})
	);
}

function removeEffect(effect, store) {
	store.dispatch(actions.removeEffect({ id: effect.id }));
}

function toggleEffect(effect, selected_ids, store) {
	store.dispatch(actions.setEffect({ selected_ids, props: { id: effect.id, visible: !effect.visible } }));
}

function openPicker(event, effect, setPicker, selected_ids, store) {
	const setProperty = (effect) => {
		store.dispatch(actions.setEffect({ selected_ids, props: effect }));
	};
	const selector = (state) => {
		return flatten(state.present.elements)
			.filter((element) => element.type !== 'group' && element.selected)
			.map((element) => element.effect)
			.flat()
			.find((prop) => prop.id === effect.id);
	};
	setPicker(
		<Picker setProperty={setProperty} selector={selector} event={event} setPicker={setPicker}>
			Effect
		</Picker>
	);
}

function updateEffect(event, effect, selected_ids, store, formatter: Function = Number) {
	store.dispatch(
		actions.setEffect({
			selected_ids,
			props: {
				id: effect.id,
				[event.target.id]: formatter(event.target.value),
			},
		})
	);
}

function EffectInput({ effect, setPicker, selected_ids, store }) {
	const color_string = Colors.toString(effect.color, effect.format);
	const [color, setColor] = useState(color_string);
	useEffect(() => setColor(color_string), [color_string]);

	function changeColor(event) {
		const new_color = event.target.value;
		setColor(new_color);
		if (Colors.isValid(new_color)) {
			store.dispatch(
				actions.setEffect({
					selected_ids,
					props: {
						...effect,
						color: Colors.hslaToHsba(Colors.rgbaToHsla(Colors.stringToRgba(new_color))),
						format: Colors.getFormat(new_color),
					},
				})
			);
		}
	}

	return (
		<div key={effect.id}>
			<div className="property-row">
				<div>::</div>
				<div className="checker-background">
					<div className="property-color" onClick={(event) => openPicker(event, effect, setPicker, selected_ids, store)} style={{ background: Colors.toString(effect.color) }} />
				</div>
				<Text placeholder="Color" className={Colors.isValid(color) || 'invalid'} onChange={changeColor}>
					{color}
				</Text>

				<Eye open={effect.visible} onClick={() => toggleEffect(effect, selected_ids, store)} />
				<Minus onClick={() => removeEffect(effect, store)} />
			</div>

			<div className="grid" style={{ gap: `8px calc(max(20vw, 15px) / 20)` }}>
				<Select id="type" value={effect.type} onChange={(event) => updateEffect(event, effect, selected_ids, store, (val) => val)}>
					<option value="Drop shadow">Drop Shadow</option>
					<option value="Inner shadow">Inner Shadow</option>
				</Select>
			</div>

			<div className="grid" style={{ gap: `8px calc(max(20vw, 15px) / 20)` }}>
				<Input id="x" label="X" value={effect.x} onChange={(event) => updateEffect(event, effect, selected_ids, store)} />
				<Input id="y" label="Y" value={effect.y} onChange={(event) => updateEffect(event, effect, selected_ids, store)} />
				<Input id="blur" label="Blur" value={effect.blur} min={0} onChange={(event) => updateEffect(event, effect, selected_ids, store)} />
				<Input id="spread" label="Spread" value={effect.spread} onChange={(event) => updateEffect(event, effect, selected_ids, store)} />
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
