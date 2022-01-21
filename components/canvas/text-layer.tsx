import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function TextLayer({ canvas, user_id, store, actions }) {
	const selected = useSelector((state: RootState) => (state as any).present.elements.filter((element) => element.selected));
	const view = useSelector((state: RootState) => (state as any).present.views.find((view) => view.id === user_id));

	const container = useRef(null);

	useEffect(() => {
		if (container.current === null) return;
		container.current.addEventListener('wheel', (event) => {
			event.preventDefault();
			console.log(event.type);
			// Clone event through to the canvas
			canvas.dispatchEvent(new event.constructor(event.type, event));
		});
	}, [container.current]);

	if (selected.length === 0 || selected[0].type !== 'text' || typeof view === 'undefined') return null;

	const selected_ids = selected.map((element) => element.id);
	function updateText(event, alter = (value) => value) {
		store.dispatch(actions.property({ selected_ids, props: { [event.target.id]: alter(event.target.value) } }));
	}

	return (
		<>
			<div id="container" ref={container}>
				<div id="relative">
					<textarea id="text" onChange={updateText} placeholder="Text..." value={selected[0].text === 'Text...' ? undefined : selected[0].text} />
				</div>
			</div>
			<style jsx>{`
				#container {
					height: 100%;
					width: 100%;
					pointer-events: none;
					position: absolute;
				}
				#relative {
					height: 100%;
					width: 100%;
					position: relative;
				}
				textarea {
					position: absolute;
					top: ${(selected[0].y * view.scale) / window.devicePixelRatio + view.y / window.devicePixelRatio}px;
					left: ${(selected[0].x * view.scale) / window.devicePixelRatio + view.x / window.devicePixelRatio}px;

					height: ${Math.abs(selected[0].height)}px;
					width: ${Math.abs(selected[0].width)}px;
					transform-origin: 0 0;
					transform: translate(${0}px, ${0}px) scale(${view.scale / window.devicePixelRatio});
					resize: none;
					outline: none;
					pointer-events: all;
					border-radius: 0;
					text-align: ${selected[0].justified};
					align-items: ${selected[0].align};
					background: transparent;
					overflow: visible;
					font-family: ${selected[0].family};
					font-size: ${Math.abs(selected[0].size)}px;
					font-weight: ${selected[0].weight};
					font-style: ${selected[0].style};
					box-sizing: border-box;
					padding: 0;
					margin: 0;
					border: 0;
				}
				textarea:focus {
					outline: none;
				}
			`}</style>
		</>
	);
}
