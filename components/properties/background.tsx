import Text from './inputs/text';
import Colors from './colors';
import Eye from '../icons/eye';
import Picker from '../picker';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';

export default function Background({ store, actions, setPicker }) {
	const page = useSelector(
		(state: RootState) => state.present.page,
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	function openPicker(event) {
		const setBackground = (page) => {
			store.dispatch(actions.setBackground(page));
		};
		const selector = (state) => state.present.page;
		setPicker(
			<Picker setProperty={setBackground} selector={selector} event={event} setPicker={setPicker}>
				<div style={{ color: 'white', lineHeight: '30px', width: 'max-content' }}>Background</div>
			</Picker>
		);
	}

	const color_string = Colors.toString(page.color, page.format);

	const [color, setColor] = useState(color_string);
	useEffect(() => setColor(color_string), [color_string]);

	function updateColor(event) {
		const new_color = event.target.value;
		setColor(new_color);
		if (Colors.isValid(new_color)) {
			store.dispatch(
				actions.setBackground({
					...page,
					color: Colors.hslaToHsba(Colors.rgbaToHsla(Colors.stringToRgba(new_color))),
					format: Colors.getFormat(new_color),
				})
			);
		}
	}

	function toggleVisible() {
		store.dispatch(
			actions.setBackground({
				...page,
				visible: !page.visible,
			})
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
						<div className="property-color" onClick={(event) => openPicker(event)} style={{ background: Colors.toString(page.color) }} />
					</div>
					<Text id="color" placeholder="Color" className={Colors.isValid(color) || 'invalid'} onChange={updateColor}>
						{color}
					</Text>
					<Eye open={page.visible} onClick={toggleVisible} />

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
