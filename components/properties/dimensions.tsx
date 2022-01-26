import Input from './inputs/input';

export default function Dimensions({ selected, store, actions, width }) {
	const selected_ids = selected.map((element) => element.id);
	function updateDimension(event) {
		if (Number.isNaN(event.target.value) || event.target.value === '') return;
		store.dispatch(actions.property({ selected_ids, props: { [event.target.id]: Number(event.target.value) } }));
	}

	function updateRotation(event) {
		if (Number.isNaN(event.target.value) || event.target.value === '') return;
		store.dispatch(actions.property({ selected_ids, props: { [event.target.id]: Number(event.target.value) / 57.29577951308232 } }));
	}

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>DIMENSIONS</h4>
			</div>
			<div id="properties">
				<Input id="x" label="X" value={selected[0].x} onChange={updateDimension} width={width} />
				<Input id="y" label="Y" value={selected[0].y} onChange={updateDimension} width={width} />

				<Input id="x1" label="X1" value={selected[0].x1} onChange={updateDimension} width={width} />
				<Input id="y1" label="Y1" value={selected[0].y1} onChange={updateDimension} width={width} />

				<Input id="x2" label="X2" value={selected[0].x2} onChange={updateDimension} width={width} />
				<Input id="y2" label="Y2" value={selected[0].y2} onChange={updateDimension} width={width} />

				<Input id="width" label="W" value={selected[0].width} onChange={updateDimension} width={width} />
				<Input id="height" label="H" value={selected[0].height} onChange={updateDimension} width={width} />

				<Input
					id="rotation"
					label={
						<svg viewBox="0 0 10 10">
							<path d="M 2 2 L 2 8 L 8 8 M 2 4 A 3.5 3.5 0 0 1 6 8" />
						</svg>
					}
					unit="°"
					value={(selected[0].rotation * 57.29577951308232) % 360}
					onChange={updateRotation}
					width={width}
				/>

				<Input
					id="radius"
					label={
						<svg viewBox="0 0 10 10">
							<path d="M 2 8 L 2 5 A 3 3 0 0 1 5 2 L 8 2 " />
						</svg>
					}
					value={selected[0].radius}
					onChange={updateDimension}
					width={width}
				/>
			</div>
			<style jsx>{`
				#properties {
					display: grid;
					grid-template-columns: auto auto;
					gap: 8px calc(${width} / 20);
					height: min-content;
					width: 100%;
					box-sizing: border-box;
					padding: 0 10px;
					overflow: hidden;
				}
				svg {
					fill: none;
					margin-top: 3px;
					margin-bottom: -3px;
					height: 20px;
					width: 100%;
					stroke: white;
					stroke-width: 0.5px;
				}
			`}</style>
		</div>
	);
}
