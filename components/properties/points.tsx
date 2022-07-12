import actions from '../../redux/slice';
import { Point } from '../../types/element-types';
import Elements from '../canvas/elements/elements';
import Input from '../inputs/input';
import Select from '../inputs/select';

export default function Points({ editing, store }) {
	const points = editing
		.map((element) => Elements[element.type].getPoints(element))
		.flat()
		.filter((point) => point.selected || point.controls.find((control) => control.selected));

	if (points.length === 0) return <></>;

	let selected = null;

	if (points[0].selected) {
		selected = points[0];
	} else if (points[0].controls[0].selected) {
		selected = points[0].controls[0];
	} else if (points[0].controls[1].selected) {
		selected = points[0].controls[1];
	}

	// const radii = points.map((point) => point.radius);
	// const radius = radii.every((radius) => radius === radii[0]) ? radii[0] : 'Mixed';

	return (
		<div className="property-container">
			<div className="property-heading">
				<h4>POINT</h4>
			</div>
			<div className="properties">
				<Input id="x" label="X" value={selected.x} onChange={(event) => updatePoints(event, store)} />
				<Input id="y" label="Y" value={selected.y} onChange={(event) => updatePoints(event, store)} />
			</div>

			<div className="properties">
				<Select id="type" value={points[0].relation} onChange={(event) => setRelation(event, store)}>
					<option>Mirror angle and length</option>
					<option>Mirror angle</option>
					<option>No Relation</option>
				</Select>
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

function updatePoints(event, store) {
	if (Number.isNaN(event.target.value) || event.target.value === '') event.target.value = 0;
	const editing = store.getState().present.elements.filter((element) => element.editing);

	const editing_ids = editing.map((element) => element.id);

	const selected_points: Array<Point> = editing
		.map((element) => Elements[element.type].getPoints(element))
		.flat()
		.filter((point) => point.selected || point.controls.find((control) => control.selected));

	const point_ids = selected_points.map((point) => point.id);
	const control_indexes = selected_points.map((point) => [point.selected ? true : false, ...point.controls.map((control) => control.selected)]);

	const position = { x: 0, y: 0 };

	const property = event.target.id;

	let value = 0;
	if (control_indexes[0][0]) {
		value = selected_points[0][property];
	} else if (control_indexes[0][1]) {
		value = selected_points[0].controls[0][property];
	} else if (control_indexes[0][2]) {
		value = selected_points[0].controls[1][property];
	}
	const last_position = {
		x: property === 'x' ? value - Number(event.target.value) : 0,
		y: property === 'y' ? value - Number(event.target.value) : 0,
	};

	store.dispatch(actions.movePoints({ position, last_position, editing_ids, point_ids, control_indexes }));
}

function setRelation(event, store) {
	const editing = store.getState().present.elements.filter((element) => element.editing);
	const editing_ids = editing.map((element) => element.id);

	const point_ids = editing
		.map((element) => Elements[element.type].getPoints(element))
		.flat()
		.filter((point) => point.selected || point.controls.find((control) => control.selected))
		.map((point) => point.id);

	store.dispatch(actions.pointRelation({ editing_ids, point_ids, relation: event.target.value }));
}
