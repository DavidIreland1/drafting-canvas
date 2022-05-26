import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Background from './background';
import Dimensions from './dimensions';
import Fill from './fill';
import Stroke from './stroke';
import Effects from './effects';
import Text from './text';

export default function Properties({ store, setPicker, fonts }) {
	const selected = useSelector(
		(state: RootState) => state.present.elements.filter((element) => element.selected),
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	return (
		<div id="container">
			{selected.length === 0 ? (
				<Background store={store} setPicker={setPicker}></Background>
			) : (
				<div>
					<Dimensions selected={selected} store={store} />
					<div className="divider" />
					<Text selected={selected} store={store} fonts={fonts} />
					<Fill selected={selected} store={store} setPicker={setPicker} />
					<div className="divider" />
					<Stroke selected={selected} store={store} setPicker={setPicker} />
					<div className="divider" />
					<Effects selected={selected} store={store} setPicker={setPicker} />
				</div>
			)}

			<style jsx>{`
				#container {
					color: var(--text);
					background: var(--panel);
					position: relative;
					display: grid;
					right: 0;
					padding: 10px 0;
					border-radius: var(--radius);
					height: calc(100vh - var(--nav-height) - var(--gap));
					overflow-y: auto;
					overflow-y: overlay;
				}
				#handle {
					position: absolute;
					height: 100%;
					width: 6px;
					background: transparent;
					left: -5px;
					cursor: ew-resize;
				}
				.divider {
					height: 1px;
					background: var(--border);
					margin: 10px 0;
				}
			`}</style>
		</div>
	);
}
