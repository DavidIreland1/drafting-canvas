//(x0,y0) is start point; (x1,y1),(x2,y2) is control points; (x3,y3) is end point.
export default function boundBezier(start, end) {
	if (start.controls.length === 0 || end.controls.length === 0) return [start, end];

	const x0 = start.x;
	const y0 = start.y;
	const x1 = start.controls[0].x;
	const y1 = start.controls[0].y;
	const x2 = end.controls[1].x;
	const y2 = end.controls[1].y;
	const x3 = end.x;
	const y3 = end.y;

	let t_values = [],
		x_values = [],
		y_values = [],
		a,
		b,
		c,
		t,
		t1,
		t2,
		b2ac,
		sqrtb2ac;
	for (let i = 0; i < 2; ++i) {
		if (i == 0) {
			b = 6 * x0 - 12 * x1 + 6 * x2;
			a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
			c = 3 * x1 - 3 * x0;
		} else {
			b = 6 * y0 - 12 * y1 + 6 * y2;
			a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
			c = 3 * y1 - 3 * y0;
		}
		if (Math.abs(a) < 1e-12) {
			if (Math.abs(b) < 1e-12) {
				continue;
			}
			t = -c / b;
			if (0 < t && t < 1) {
				t_values.push(t);
			}
			continue;
		}
		b2ac = b * b - 4 * c * a;
		if (b2ac < 0) {
			if (Math.abs(b2ac) < 1e-12) {
				t = -b / (2 * a);
				if (0 < t && t < 1) {
					t_values.push(t);
				}
			}
			continue;
		}
		sqrtb2ac = Math.sqrt(b2ac);
		t1 = (-b + sqrtb2ac) / (2 * a);
		if (0 < t1 && t1 < 1) {
			t_values.push(t1);
		}
		t2 = (-b - sqrtb2ac) / (2 * a);
		if (0 < t2 && t2 < 1) {
			t_values.push(t2);
		}
	}

	let j = t_values.length,
		mt;
	while (j--) {
		t = t_values[j];
		mt = 1 - t;
		x_values[j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
		y_values[j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
	}

	x_values.push(x0, x3);
	y_values.push(y0, y3);

	return [
		{ x: Math.min(...x_values), y: Math.min(...y_values) },
		{ x: Math.max(...x_values), y: Math.max(...y_values) },
	];
}
