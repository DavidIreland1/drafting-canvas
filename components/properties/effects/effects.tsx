import Picker from './../picker';
import Elements from './../../elements/elements';
import { generateID } from './../../../utils/utils';
import Colors from './../colors';
import Eye from './../../icons/eye';
import Minus from './../../icons/minus';
import Plus from './../../icons/plus';
import Input from '../input';

export default function Effect({ selected, store, actions, width, setPicker }) {
	function addEffect() {
		store.dispatch(
			actions.addEffect({
				id: generateID(),
				type: 'drop-shadow',
				x: 0,
				y: 0,
				blur: 100,
				spread: 100,
				color: [0, 0, 0, 1],
				visible: true,
			})
		);
	}

	function removeEffect(id) {
		store.dispatch(actions.removeEffect({ id }));
	}

	function toggleEffect(id) {
		store.dispatch(actions.toggleEffect({ id }));
	}

	function selectColor(event, id, color) {
		setPicker(<Picker store={store} actions={actions} id={id} color={color} event={event} setPicker={setPicker} />);
	}

	function updateEffect(id, event) {
		if (!Number.isNaN(event.target.value) || event.target.value === '') store.dispatch(actions.effect({ id, [event.target.parentNode.id]: Number(event.target.value) }));
	}

	function toEffect(effect) {
		return (
			<div key={effect.id}>
				<div className="property-row">
					<div className="property-color" onClick={(event) => selectColor(event, effect.id, effect.color)} style={{ background: Colors.rgbaToString(effect.color) }} />
					{Colors.rgbaToHex(effect.color)}

					<Eye open={effect.visible} onClick={() => toggleEffect(effect.id)} />
					<Minus onClick={() => removeEffect(effect.id)} />
				</div>
				<div className="grid">
					<Input id="x" label="X" value={effect.x} onChange={(event) => updateEffect(effect.id, event)} width={width} />
					<Input id="y" label="Y" value={effect.y} onChange={(event) => updateEffect(effect.id, event)} width={width} />
					<Input id="blur" label="Blur" value={effect.blur} min={0} onChange={(event) => updateEffect(effect.id, event)} width={width} />
					<Input id="spread" label="Spread" value={effect.spread} onChange={(event) => updateEffect(effect.id, event)} width={width} />
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
				<h4>EFFECTS</h4>
				<Plus onClick={addEffect} />
			</div>

			{selected
				.map((element) => Elements[element.type].getEffect(element))
				.flat()
				.map(toEffect)}
		</div>
	);
}
