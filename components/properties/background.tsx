import Text from './inputs/text';
import Colors from './colors';
import Eye from '../icons/eye';
import Picker from '../picker';
import Select from './inputs/select';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function Background({ store, actions, setPicker }) {
	const color = useSelector((state: RootState) => state.present.page.color);

	function openPicker(event, fill) {
		const setProperty = (fill) => {};
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

	return (
		<div>
			<div id="property-container">
				<div className="property-heading">
					<h4>Background</h4>
					{/* <Plus onClick={addFill} /> */}
				</div>

				<div className="property-row">
					<div className="property-color" onClick={(event) => openPicker(event, { color })} style={{ background: Colors.hslaToString(Colors.hsbaToHsla(color)) }} />

					<div>
						<Text id="color" placeholder="Color" onChange={console.log}>
							{Colors.rgbaToHex(color)}
						</Text>
					</div>
					<div>
						<Eye open={true} onClick={console.log} />
					</div>

					<style jsx>{`
					.blank > *,
					.blank > * > * {
						visibility: collapse;
					}
					input {
						min-width: 10px;
						border
					}
					#handle {
						cursor: default;
						border-radius: 4px;
						padding: 0 5px;

					}
					#handle:hover {
						background: var(--hover)
					}
					.property-row {
						grid-template-columns: max-content 1fr 30px;
					}
				`}</style>
				</div>
			</div>
		</div>
	);
}
