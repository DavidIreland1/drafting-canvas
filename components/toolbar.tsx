import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Settings from './settings';

export default function Navbar({ store, actions }) {
	// const [cursor.type, setTool] = useState('select');

	let cursor = useSelector((state: RootState) => (state as any).present.cursors.find((cursor) => cursor.id === Settings.user_id));

	const selectTool = (event) => {
		event.preventDefault();
		const tool = event.nativeEvent.composedPath().find((element) => element.tagName === 'svg');

		if (tool)
			store.dispatch(
				actions.cursor({
					id: Settings.user_id,
					type: tool.id,
					mode: tool.id === 'select' ? 'edit' : 'create',
				})
			);
	};

	if (!cursor || !['rectangle', 'line', 'ellipse'].includes(cursor.type)) cursor = { type: 'select' };

	return (
		<div id="container">
			<div id="bar" onMouseDown={selectTool}>
				<svg id="select" className={cursor.type === 'select' ? 'selected' : ''} viewBox="0 0 100 100">
					<path d="M 30 15 l 0 70 l 23 -15 l 32 -3 L 30 15" />
				</svg>
				<svg id="rectangle" className={cursor.type === 'rectangle' ? 'selected' : ''} viewBox="0 0 100 100">
					<rect x="20" y="20" width="60" height="60" />
				</svg>
				<svg id="line" className={cursor.type === 'line' ? 'selected' : ''} viewBox="0 0 100 100">
					<rect x="15" y="15" width="15" height="15" />
					<line x1="30" y1="30" x2="70" y2="70" />
					<rect x="70" y="70" width="15" height="15" />
				</svg>
				<svg id="ellipse" className={cursor.type === 'ellipse' ? 'selected' : ''} viewBox="0 0 100 100">
					<circle cx="50" cy="50" r="30" />
				</svg>
			</div>

			<style jsx>{`
				#container {
					background: #212123;
				}
				#bar {
					height: 100%;
					width: var(--nav-height);
					color: var(--text-color);
					padding: 6px;
					box-sizing: border-box;
					display: grid;
					grid-gap: 10px;
					height: fit-content;
				}
				img,
				svg {
					height: var(--nav-height);
					width: var(--nav-height);
				}
				svg {
					width: 100%;
					height: calc(var(--nav-height) - 12px)
					cursor: pointer;
					fill: none;
					stroke: var(--text-color);
					padding: 2px;
					stroke-width: 5;
					margin: auto;
					border-radius: 4px;
				}
				svg.selected {
					fill:  var(--text-color);
					background: var(--hover);
				}
				svg:hover {
					background: var(--hover);
				}
			`}</style>
		</div>
	);
}
