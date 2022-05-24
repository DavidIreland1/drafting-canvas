import actions from '../../redux/slice';
import Elements from '../canvas/elements/elements';
import Input from '../inputs/input';

export default function Dimensions({ selected, store, width }) {
	function updateDimension(event, formatter: Function = Number) {
		if (Number.isNaN(event.target.value) || event.target.value === '') return;
		store.dispatch(actions.property({ selected_ids: selected.map((element) => element.id), props: { [event.target.id]: formatter(event.target.value), last: formatter(event.target.last) } }));
	}

	const bounds = Elements[selected[0].type].bound(selected[0]);

	const points = Elements[selected[0].type].getPoints(selected[0]);
	const radii = points.map((point) => point.radius);
	const radius = radii.every((v) => v === radii[0]) ? radii[0] : 'Mixed';

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>DIMENSIONS</h4>
			</div>
			<div id="properties" style={{ gap: `8px calc(${width} / 20)` }}>
				<Input id="x" label="X" value={bounds.x} onChange={updateDimension} width={width} />
				<Input id="y" label="Y" value={bounds.y} onChange={updateDimension} width={width} />

				{/* <Input id="x1" label="X1" value={selected[0].x1} onChange={updateDimension} width={width} />
				<Input id="y1" label="Y1" value={selected[0].y1} onChange={updateDimension} width={width} />

				<Input id="x2" label="X2" value={selected[0].x2} onChange={updateDimension} width={width} />
				<Input id="y2" label="Y2" value={selected[0].y2} onChange={updateDimension} width={width} /> */}

				<Input id="width" label="W" value={bounds.width} onChange={updateDimension} width={width} />
				<Input id="height" label="H" value={bounds.height} onChange={updateDimension} width={width} />

				<Input
					id="rotation"
					label={
						<svg viewBox="0 0 10 10">
							<path d="M 2 2 L 2 8 L 8 8 M 2 4 A 3.5 3.5 0 0 1 6 8" />
						</svg>
					}
					unit="°"
					value={selected[0].rotation * 57.29577951308232}
					onChange={(event) => updateDimension(event, (rotation) => Number(rotation) / 57.29577951308232)}
					width={width}
				/>

				<Input
					id="radius"
					label={
						<svg viewBox="0 0 10 10">
							<path d="M 2 8 L 2 5 A 3 3 0 0 1 5 2 L 8 2 " />
						</svg>
					}
					min={0}
					step={0.1}
					value={radius}
					onChange={updateDimension}
					width={width}
				/>
			</div>
			<style jsx>{`
				#properties {
					display: grid;
					grid-template-columns: auto auto;
					height: min-content;
					width: 100%;
					box-sizing: border-box;
					padding: 0 10px;
					overflow: hidden;
				}
				svg {
					fill: none;
					height: 100%;
					width: 20px;
					stroke: var(--text);
					stroke-width: 0.5px;
				}
			`}</style>
		</div>
	);
}
