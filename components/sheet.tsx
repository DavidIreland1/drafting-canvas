import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Canvas from './canvas/canvas';
import Toolbar from './toolbar';
import Structure from './structure/structure';
import Properties from './properties/properties';

import Settings from './settings';
import getFonts from '../utils/get-fonts';
import actions from '../redux/slice';

export default function Sheet({ store }) {
	const router = useRouter();

	const [picker, setPicker] = useState(null);
	const [fonts, setFonts] = useState(null);

	useEffect(() => {
		const { page } = router.query;
		if (!page) return;

		// Hack fix as adding user before state sync causes error in other users
		const time_delay = window.hasOwnProperty('Primus') ? 1000 : 0;
		setTimeout(() => {
			store.dispatch(actions.addUser({ user_id: Settings.user_id, label: Settings.user_name, color: Settings.user_color }));
		}, time_delay);

		window.addEventListener('beforeunload', () => {
			store.dispatch(actions.removeUser({ user_id: Settings.user_id }));
		});
	}, [router.query, store]);

	useEffect(() => {
		getFonts().then(setFonts);
	}, []);

	const grid = useRef(null);
	const canvas = useRef(null);

	const [columns, setColumns] = useState([0.2, 0.6, 0.2]);

	function resize(event, first_column) {
		event.preventDefault();
		event.target.setPointerCapture(event.pointerId);
		const bounds = grid.current.getBoundingClientRect();

		function move(move_event) {
			const position = move_event.clientX;
			const left = Math.min(first_column ? bounds.width : columns[0], Math.max(position - bounds.left, 0) / bounds.width);
			const middle = first_column ? Math.max(columns[1] - (left - columns[0]), 0) : Math.max((position - bounds.left) / bounds.width - left, 0);
			// requestAnimationFrame(() => {
			setColumns([left, middle, 1 - left - middle]);
			canvas.current.onResize();
			// });
		}
		event.target.addEventListener('pointermove', move);
		function stop() {
			event.target.releasePointerCapture(event.pointerId);
			event.target.removeEventListener('pointermove', move);
		}
		event.target.addEventListener('pointerup', stop, { once: true });
	}

	return (
		<div id="sheet">
			{picker}
			<Toolbar store={store} />
			<div id="grid" ref={grid} style={{ gridTemplateColumns: `${columns[0]}fr var(--gap) ${columns[1]}fr var(--gap) ${columns[2]}fr` }}>
				<Structure store={store} />
				<div id="divider-1" className="divider" onPointerDown={(event) => resize(event, true)} />
				<Canvas ref={canvas} user_id={Settings.user_id} store={store} />
				<div id="divider-2" className="divider" onPointerDown={(event) => resize(event, false)} />
				<Properties store={store} setPicker={setPicker} fonts={fonts} />
			</div>

			<style jsx>{`
				#sheet {
					position: relative;
					display: grid;
					gap: var(--gap);
					grid-auto-flow: column;
					grid-template-columns: var(--nav-height) 1fr;
					height: 100%;
				}
				#grid {
					display: grid;
					width: 100%;
					height: 100%;
				}
				.divider {
					cursor: ew-resize;
				}
			`}</style>
		</div>
	);
}
