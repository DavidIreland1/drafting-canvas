import { useSelector } from 'react-redux';
import actions from '../redux/slice';
import Settings from './settings';

export default function Navbar({ store }) {
	let cursor = useSelector(
		(state) => (state as any).present.cursors.find((cursor) => cursor.id === Settings.user_id),
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	// Need a default cursor when there is no users
	if (!cursor || !['rectangle', 'line', 'ellipse', 'pen', 'spline', 'frame', 'text'].includes(cursor.type)) cursor = { type: 'select' };

	const selectTool = (event) => {
		event.preventDefault();
		const tool = event.nativeEvent.composedPath().find((element) => element.tagName === 'svg');

		if (tool) {
			store.dispatch(
				actions.cursor({
					user_id: Settings.user_id,
					type: tool.id,
					mode: tool.id === 'select' ? 'edit' : 'create',
				})
			);
		}
	};

	return (
		<div id="container">
			<div id="bar" onMouseDown={selectTool}>
				<svg id="select" className={cursor.type === 'select' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Select</title>
					<path d="M 30 15 l 0 70 l 23 -15 l 32 -3 Z" />
				</svg>
				<svg id="rectangle" className={cursor.type === 'rectangle' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Rectangle</title>
					<rect x="20" y="20" width="60" height="60" />
				</svg>

				<svg id="ellipse" className={cursor.type === 'ellipse' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Ellipse</title>
					<circle cx="50" cy="50" r="30" />
				</svg>

				<svg id="line" className={cursor.type === 'line' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Line</title>
					<rect x="15" y="15" width="15" height="15" />
					<line x1="30" y1="30" x2="70" y2="70" />
					<rect x="70" y="70" width="15" height="15" />
				</svg>

				<svg id="text" className={cursor.type === 'text' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Text</title>
					<line x1="20" y1="20" x2="80" y2="20" />
					<line x1="50" y1="20" x2="50" y2="80" />
				</svg>

				<svg id="spline" className={cursor.type === 'spline' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Spline</title>
					<rect x="15" y="15" width="15" height="15" />
					<path d="M 22.5 30 C 22.5 70, 77.5 30, 77.5 70 " />
					<rect x="70" y="70" width="15" height="15" />
				</svg>

				{/* <svg id="frame" className={cursor.type === 'frame' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Frame</title>
					<line x1="33" y1="15" x2="33" y2="85" />
					<line x1="67" y1="15" x2="67" y2="85" />

					<line x1="15" y1="33" x2="85" y2="33" />
					<line x1="15" y1="67" x2="85" y2="67" />
				</svg> */}

				{/* <svg id="pen" className={cursor.type === 'pen' ? 'selected' : ''} viewBox="0 0 100 100">
					<title>Pen</title>
					<path d="M 26 6 L 45 45 A 5 5 0 1 0 47.1 45 M 26 6 V 72 C 25 74 45 70 55 93 L 75 83 C 64 55 80 54 78 48 Z" />
				</svg> */}
			</div>

			<style jsx>{`
				#container {
					background: var(--nav);
					z-index: 2;
					width: var(--nav-height);
					box-sizing: border-box;
					border-radius: var(--radius);
				}
				#bar {
					width: 100%;
					color: var(--text);
					padding: 7px 5px;
					box-sizing: border-box;
					display: grid;
					grid-gap: 4px;
					height: fit-content;
				}
				svg {
					width: 100%;
					cursor: pointer;
					fill: none;
					stroke: var(--text);
					padding: 2px;
					box-sizing: border-box;
					stroke-width: 5;
					margin: auto;
					border-radius: 4px;
					height: 35px;
				}
				svg.selected {
					fill: var(--text);
					background: var(--hover);
				}
				svg:hover {
					background: var(--hover);
				}
			`}</style>
		</div>
	);
}
