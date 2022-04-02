import Settings from '../settings';

export default class Grid {
	static draw(context: CanvasRenderingContext2D, view) {
		if (view.scale < Settings.grid_min_scale) return;

		const step = Settings.grid_step * view.scale;

		const top = Math.floor(view.y % step) - step;
		const left = Math.floor(view.x % step) - step;

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

		context.fillStyle = 'transparent';
		context.shadowColor = 'transparent';
		context.strokeStyle = `rgba(0, 0, 0, ${0.1 * (view.scale - Settings.grid_min_scale)})`;
		context.lineWidth = Math.max(Settings.grid_line_width / view.scale, 0.1);
		context.stroke();
	}
}
