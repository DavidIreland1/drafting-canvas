import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Background from './background';
import Dimensions from './dimensions';
import Points from './points';
import Fill from './fill';
import Stroke from './stroke';
import Effects from './effects';
import Text from './text';

export default function Properties({ store, setPicker, fonts }) {
	const selected = useSelector(
		(state: RootState) => state.present.elements.filter((element) => element.selected),
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	const editing = selected.filter((element) => element.editing);

	return (
		<div id="container">
			{selected.length === 0 ? (
				<Background store={store} setPicker={setPicker}></Background>
			) : (
				<>
					{editing.length === 0 ? (
						<Dimensions selected={selected} store={store} />
					) : (
						// <div>Point stuff</div>
						<Points editing={editing} store={store} />
					)}
					<Text selected={selected} store={store} fonts={fonts} />
					<Fill selected={selected} store={store} setPicker={setPicker} />
					<Stroke selected={selected} store={store} setPicker={setPicker} />
					<Effects selected={selected} store={store} setPicker={setPicker} />
				</>
			)}
			<div id="spacer" className="property-container" />

			<style jsx>{`
				#container {
					display: flex;
					flex-direction: column;
					gap: var(--gap);
					grid-template-rows: repeat(auto-fit, min-content) 1fr;
					border-radius: var(--radius);
					height: calc(100vh - var(--nav-height) - var(--gap));
					overflow-y: auto;
					overflow-y: overlay;
				}
				.grid {
					display: grid;
					gap: var(--gap);
				}
				.divider {
					height: 4px;
					background: var(--background);
					margin: 10px 0;
				}
				#spacer {
					height: 100%;
					width: 100%;
				}
			`}</style>
		</div>
	);
}
