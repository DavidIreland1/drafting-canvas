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

			<style>{`
				.property-container {
					padding: 10px 0;
				}
				.property-heading {
					display: grid;
					grid-template-columns: 1fr 30px;
					padding: 0 10px 5px 10px;
					gap: 5px;
				}
				h4 {
					cursor: default;
					margin: 0;
					padding: 5px 0;
					font-weight: 300;
				}
			`}</style>

			<style>{`
				.checker-background {
					margin: auto;
					width: 1.5em;
					height: 1.5em;
					white: white;
					background-color: lightgrey;
					background-image: linear-gradient(45deg, white 25%, transparent 0%, transparent 75%, white 75%), linear-gradient(45deg, white 25%, transparent 0%, transparent 75%, white 75%);
					background-position: 0 0, 0.3em 0.3em;
					background-size: calc(0.3em * 2) calc(0.3em * 2);
				}
				.property-color {
					position: absolute;
					width: 1.5em;
					height: 1.5em;
					box-shadow: var(--text) 0px 0px 2px -1px;
					/*border: 0.5px solid var(--text);*/
				}
				.property-row {
					padding: 0 10px 0 5px;
					display: grid;
					grid-template-columns: min-content max-content 1fr 30px 30px;
					gap: 5px;
					line-height: 28px;
				}
				.property-minus {
					width: 100%;
					height: 100%;
					margin: auto;
					border-radius: 6px;
				}
				.property-minus  svg,
					height: 100%;
					width: 100%;
				}
				.property-minus:hover {
					background-color: var(--hover);
				}
			`}</style>

			<style jsx>{`
				#container {
					color: var(--text);
					background-color: var(--panel);
					position: relative;
					display: grid;
					right: 0;
					padding: 10px 0;
					border-radius: var(--radius);
					height: calc(100vh - var(--nav-height) - var(--gap));
					overflow-y: overlay;
				}
				#handle {
					position: absolute;
					height: 100%;
					width: 6px;
					background-color: transparent;
					left: -5px;
					cursor: ew-resize;
				}
				.divider {
					height: 1px;
					background-color: var(--border);
					margin: 10px 0;
				}
			`}</style>
		</div>
	);
}
