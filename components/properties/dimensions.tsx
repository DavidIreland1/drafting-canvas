import actions from '../../redux/slice';
import { ElementType } from '../../types/element-types';
import Group from '../canvas/elements/group';
import Input from '../inputs/input';

export default function Dimensions({ selected, store }) {
	function updateDimension(event, formatter: Function = Number) {
		if (Number.isNaN(event.target.value) || event.target.value === '') return;

		const selected = store.getState().present.elements.filter((element) => element.selected);
		const group = { elements: selected, type: 'group', rotation: selected[0].rotation } as ElementType;
		const bounds = Group.bound(group);
		(bounds as any).rotation = selected[0].rotation;

		const sign = Math.sign(event.target.value);
		const delta = formatter(event.target.value) - bounds[event.target.id];
		store.dispatch(
			actions.property({
				selected_ids: selected.map((element) => element.id),
				props: { [event.target.id]: [delta, sign] },
			})
		);
	}

	const group = { elements: selected, type: 'group', rotation: selected[0].rotation } as ElementType;
	const bounds = Group.bound(group);
	const points = Group.getPoints(group);

	const radii = points.map((point) => point.radius);
	const radius = radii.every((radius) => radius === radii[0]) ? radii[0] : 'Mixed';

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>DIMENSIONS</h4>
			</div>
			<div id="properties">
				<Input id="x" label="X" value={bounds.x} onChange={updateDimension} />
				<Input id="y" label="Y" value={bounds.y} onChange={updateDimension} />

				<Input id="width" label="W" value={bounds.width} onChange={(event) => updateDimension(event, Math.abs)} />
				<Input id="height" label="H" value={bounds.height} onChange={updateDimension} />

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
				/>
			</div>
			<style jsx>{`
				#properties {
					display: grid;
					gap: 8px;
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
