import Picker from '../../picker';
import Elements, { flatten } from './../../elements/elements';
import { generateID } from './../../../utils/utils';
import Colors from './../colors';
import Eye from './../../icons/eye';
import Minus from './../../icons/minus';
import Plus from './../../icons/plus';
import Input from '../inputs/input';
import Text from '../inputs/text';
import Select from '../inputs/select';

export default function Effect({ selected, store, actions, setPicker, width }) {
	const selected_ids = selected.map((element) => element.id);

	function addEffect() {
		store.dispatch(
			actions.addEffect({
				selected_ids,
				props: {
					id: generateID(),
					type: 'Drop shadow',
					// type: 'Inner shadow',
					x: 0,
					y: 0,
					blur: 10,
					spread: 0,
					color: [0, 0, 0, 1],
					visible: true,
				},
			})
		);
	}

	function removeEffect(effect) {
		store.dispatch(actions.removeEffect({ id: effect.id }));
	}

	function toggleEffect(effect) {
		store.dispatch(actions.setEffect({ selected_ids, props: { id: effect.id, visible: !effect.visible } }));
	}

	function openPicker(event, effect) {
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

	function updateEffect(event, effect) {
		store.dispatch(
			actions.setEffect({
				selected_ids,
				props: {
					id: effect.id,
					[event.target.id]: event.target.value,
				},
			})
		);
	}

	function getEffects(selected) {
		return selected.map((element) => Elements[element.type].getEffect(element)).flat();
	}

	function toEffect(effect) {
		return (
			<div key={effect.id}>
				<div className="property-row">
					<div>::</div>
					<div className="checker-background">
						<div className="property-color" onClick={(event) => openPicker(event, effect)} style={{ background: Colors.toString(effect.color) }} />
					</div>
					<Text onChange={console.log}>{Colors.rgbaToHex8(effect.color)}</Text>

					<Eye open={effect.visible} onClick={() => toggleEffect(effect)} />
					<Minus onClick={() => removeEffect(effect)} />
				</div>

				<div className="grid" style={{ gap: `8px calc(max(20vw, 15px) / 20)` }}>
					<Select id="type" value={effect.type} onChange={(event) => updateEffect(event, effect)}>
						<option value="Drop shadow">Drop Shadow</option>
						<option value="Inner shadow">Inner Shadow</option>
					</Select>
				</div>

				<div className="grid" style={{ gap: `8px calc(max(20vw, 15px) / 20)` }}>
					<Input id="x" label="X" value={effect.x} onChange={(event) => updateEffect(event, effect)} width={width} />
					<Input id="y" label="Y" value={effect.y} onChange={(event) => updateEffect(event, effect)} width={width} />
					<Input id="blur" label="Blur" value={effect.blur} min={0} onChange={(event) => updateEffect(event, effect)} width={width} />
					<Input id="spread" label="Spread" value={effect.spread} onChange={(event) => updateEffect(event, effect)} width={width} />
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
			<div className="property-heading" onClick={addEffect}>
				<h4>EFFECTS</h4>
				<Plus />
			</div>

			{getEffects(selected).map(toEffect)}
		</div>
	);
}
