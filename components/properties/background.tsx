import Text from './inputs/text';
import Colors from './colors';
import Eye from '../icons/eye';
import Picker from '../picker';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function Background({ store, actions, setPicker }) {
	const page = useSelector(
		(state: RootState) => state.present.page,
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	function openPicker(event) {
		const setBackground = (page) => store.dispatch(actions.setBackground(page));
		const selector = (state) => state.present.page;
		setPicker(
			<Picker setProperty={setBackground} selector={selector} event={event} setPicker={setPicker}>
				<div style={{ color: 'white', lineHeight: '30px', width: 'max-content' }}>Background Color</div>
			</Picker>
		);
	}

	return (
		<div>
			<div id="property-container">
				<div className="property-heading">
					<h4>Background</h4>
				</div>

				<div className="property-row">
					<div className="checker-background">
						<div className="property-color" onClick={(event) => openPicker(event)} style={{ background: Colors.hslaToString(Colors.hsbaToHsla(page.color)) }} />
					</div>
					<Text id="color" placeholder="Color" onChange={console.log}>
						{Colors.rgbaToHex(page.color)}
					</Text>
					<Eye open={true} onClick={console.log} />

					<style jsx>{`
						.property-row {
							grid-template-columns: max-content 1fr 30px;
							padding: 0 15px;
						}
					`}</style>
				</div>
			</div>
		</div>
	);
}
