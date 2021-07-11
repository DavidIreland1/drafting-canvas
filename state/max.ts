export default function getPage() {
	return {
		id: '123',
		label: 'test',
		elements: Array.apply(null, Array(20000)).map((element, i, array) => {
			const side = Math.round(Math.sqrt(array.length));
			return {
				id: '35674' + i,
				type: 'circle',
				selected: false,
				hover: false,
				x: (2000 / side) * (i % side),
				y: (2000 / side) * Math.round(i / side),
				color: 'red',
				rotation: 0,
				radius: 5,
				start_angle: 0,
				end_angle: 2 * Math.PI,
			};
		}),
	};
}
