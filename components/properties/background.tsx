import Text from './../inputs/text';
import Colors from './colors';
import Eye from '../icons/eye';
import Picker from '../picker';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import actions from '../../redux/slice';

export default function Background({ store, setPicker }) {
	const page = useSelector(
		(state: RootState) => state.present.page,
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	function openPicker(event) {
		const setBackground = (page) => store.dispatch(actions.page(page));
		const selector = (state) => state.present.page;
		setPicker(
			<Picker setProperty={setBackground} selector={selector} event={event} setPicker={setPicker}>
				<h4 style={{ lineHeight: '30px', width: 'max-content' }}>Background Color</h4>
			</Picker>
		);
	}

	const color_string = Colors.toString(page.color, page.format);

	const [color, setColor] = useState(color_string);
	useEffect(() => setColor(color_string), [color_string]); // Hack to allow update from two inputs

	// useEffect(() => {
	// 	if (typeof window !== 'undefined') {
	// 		setTimeout(() => {
	// 			console.log(Colors.toString(page.color, page.format));
	// 			setColor(Colors.toString(page.color, page.format));
	// 		}, 100);
	// 	}
	// }, []);

	function updateColor(event) {
		const new_color = event.target.value;
		setColor(new_color);
		if (Colors.isValid(new_color)) {
			store.dispatch(
				actions.page({
					color: Colors.hslaToHsba(Colors.rgbaToHsla(Colors.stringToRgba(new_color))),
					format: Colors.getFormat(new_color),
				})
			);
		}
	}

	function toggleVisible() {
		store.dispatch(
			actions.page({
				visible: !page.visible,
			})
		);
	}

	return (
		<div>
			<div id="property-container">
				<div className="property-heading">
					<h4>BACKGROUND</h4>
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
