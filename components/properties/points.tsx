import actions from '../../redux/slice';
import { ElementType } from '../../types/element-types';
import Elements from '../canvas/elements/elements';
import Group from '../canvas/elements/group';
import Input from '../inputs/input';

export default function Points({ editing, store }) {
	function updatePoints(event, formatter: Function = Number) {
		console.log(event);
		// if (Number.isNaN(event.target.value) || event.target.value === '') return;
		// const selected = store.getState().present.elements.filter((element) => element.selected);
		// const group = { elements: selected, type: 'group', rotation: selected[0].rotation } as ElementType;
		// const bounds = Group.bound(group);
		// (bounds as any).rotation = selected[0].rotation;
		// (bounds as any).radius = Elements[selected[0].type].getPoints(selected[0])[0].radius;
		// const sign = Math.sign(event.target.value);
		// const delta = formatter(event.target.value) - bounds[event.target.id];
		// store.dispatch(
		// 	actions.property({
		// 		selected_ids: selected.map((element) => element.id),
		// 		props: { [event.target.id]: [delta, sign] },
		// 	})
		// );
	}

	const points = editing
		.map((element) => Elements[element.type].getPoints(element))
		.flat()
		.filter((point) => point.selected);

	if (points.length === 0) return <></>;

	// const radii = points.map((point) => point.radius);
	// const radius = radii.every((radius) => radius === radii[0]) ? radii[0] : 'Mixed';

	return (
		<div className="property-container">
			<div className="property-heading">
				<h4>POINTS</h4>
			</div>
			<div className="properties">
				<Input id="x" label="X" value={points[0].x} onChange={updatePoints} />
				<Input id="y" label="Y" value={points[0].y} onChange={updatePoints} />
			</div>
			<style jsx>{`
				.properties {
					grid-template-columns: auto auto;
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
