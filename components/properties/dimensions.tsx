import Input from './input';

export default function Dimensions({ selected, store, actions, width }) {
	function updateDimension(event) {
		if (!Number.isNaN(event.target.value) || event.target.value === '') store.dispatch(actions.property({ [event.target.parentNode.id]: Number(event.target.value) }));
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

				<Input id="rotation" label={<div style={{ fontSize: '30px', lineHeight: '12px' }}>⊾</div>} step={0.01} value={selected[0].rotation} onChange={updateDimension} width={width} />

				<Input id="border_radius" label={<div style={{ fontSize: '24px', lineHeight: '10px', padding: '0px 8px 0px 0px' }}>╭</div>} step={0.01} value={selected[0].border_radius} onChange={updateDimension} width={width} />
			</div>
			<style jsx>{`
				#properties {
					display: grid;
					grid-template-columns: auto auto;
					gap: 8px calc(${width} / 20);
					height: min-content;
					width: fit-content;
					margin: 0 auto;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
}
