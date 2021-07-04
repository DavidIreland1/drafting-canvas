export default function getPage() {
	const elements = [
		{
			id: '35674',
			type: 'circle',
			x: 100,
			y: 100,
			color: 'red',
			radius: 60,
			start_angle: 0,
			end_angle: 2 * Math.PI,
		},
		{
			id: '3457',
			type: 'group',
			elements: [
				{
					type: 'circle',
					x: 100,
					y: 100,
					color: 'black',
					radius: 50,
					start_angle: 0,
					end_angle: 2 * Math.PI,
				},
			],
		},
		{
			id: '67484',
			type: 'circle',
			x: 1500,
			y: 1500,
			color: 'red',
			radius: 60,
			start_angle: 0,
			end_angle: 2 * Math.PI,
		},
		{
			id: '4678',
			type: 'circle',
			x: 100,
			y: 1500,
			color: 'red',
			radius: 60,
			start_angle: 0,
			end_angle: 2 * Math.PI,
		},
		{
			id: '3567',
			type: 'circle',
			x: 1500,
			y: 100,
			color: 'red',
			radius: 60,
			start_angle: 0,
			end_angle: 2 * Math.PI,
		},
		{
			id: '8764',
			type: 'circle',
			x: 800,
			y: 800,
			color: 'red',
			radius: 60,
			start_angle: 0,
			end_angle: 2 * Math.PI,
		},
	];

	return {
		id: '123',
		label: 'First Page',
		elements: elements,
	};
}
