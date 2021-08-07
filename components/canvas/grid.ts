import Settings from '../settings';

export default class Grid {
	static draw(context: CanvasRenderingContext2D, view) {
		if (view.scale < Settings.grid_min_scale) return;

		const step = Settings.grid_step * view.scale;

		const top = Math.round(view.y % step);
		const left = Math.round(view.x % step);

		const bottom = context.canvas.height;
		const right = context.canvas.width;

		context.beginPath();
		for (let x = left; x < right; x += step) {
			const _x = Math.round(x);
			context.moveTo(_x, top);
			context.lineTo(_x, bottom);
		}
		for (let y = top; y < bottom; y += step) {
			const _y = Math.round(y);
			context.moveTo(left, _y);
			context.lineTo(right, _y);
		}

		context.strokeStyle = `rgba(136, 136, 136, ${0.3 * (view.scale - Settings.grid_min_scale)})`;
		context.lineWidth = Settings.grid_line_width / view.scale;
		context.stroke();
	}
}