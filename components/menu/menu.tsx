import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Menu({ element, getContents, props }) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [contents, setContents] = useState(null);

	useEffect(() => {
		element.current.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			setPosition({ x: event.clientX, y: event.clientY });
			setContents(getContents(props, { x: event.clientX, y: event.clientY }));

			document.addEventListener(
				'mouseup',
				() => {
					document.addEventListener('mouseup', (up_event) => up_event.button !== 2 && close(up_event), { once: true });
				},
				{ once: true }
			);
		});
	}, [element, getContents, props]);

	function close(event) {
		event.preventDefault();
		requestAnimationFrame(() => setPosition({ x: 0, y: 0 }));
	}

	if (position.x === 0) return <></>;

	return createPortal(
		<div id="menu" style={{ top: position.y, left: position.x }} onContextMenu={close}>
			{contents}
			<style jsx>{`
				#menu {
					position: absolute;
					top: 0;
					left: 0;
					width: 200px;
					height: max-content;
					background: red;
					z-index: 6;
					color: var(--text);
					background: var(--panel);
					box-shadow: 0 0 10px -5px var(--text);
				}
			`}</style>
		</div>,
		document.getElementById('portal')
	);
}
