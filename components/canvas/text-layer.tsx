import { useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Colors from './../properties/colors';

export default function TextLayer({ canvas, user_id, store, actions }) {
	const selected = useSelector((state: RootState) => (state as any).present.elements.filter((element) => element.selected));
	const view = useSelector((state: RootState) => (state as any).present.views.find((view) => view.id === user_id));

	const container = useRef(null);

	useEffect(() => {
		if (container.current === null) return;
		container.current.addEventListener('wheel', (event) => {
			event.preventDefault();
			// Clone event through to the canvas
			canvas.current.dispatchEvent(new event.constructor(event.type, event));
		});
	}, [container.current]);

	if (selected.length === 0 || selected[0].type !== 'text' || typeof view === 'undefined') return null;

	const selected_ids = selected.map((element) => element.id);
	function updateText(event, alter = (value) => value) {
		store.dispatch(actions.property({ selected_ids, props: { [event.target.id]: alter(event.target.value) } }));
	}

	const style = {
		fontFamily: selected[0].family,
		textAlign: selected[0].justify,
		fontSize: Math.abs(selected[0].size) + 'px',
		fontWeight: selected[0].weight,
		fontStyle: selected[0].style,
		lineHeight: selected[0].line_height,
		color: Colors.hslaToString(Colors.hsbaToHsla(selected[0].fill[0].color)),
	};

	return (
		<>
			<div id="container" ref={container}>
				<div id="relative">
					<div id="transformed">
						<div id="rotated">
							<Editable id="text" element_id={selected[0].id} placeholder="" style={style} align={selected[0].align} value={selected[0].text === 'Text...' ? null : selected[0].text} onChange={updateText} />
						</div>
					</div>
				</div>
			</div>
			<style jsx>{`
				#container {
					height: 100%;
					width: 100%;
					pointer-events: none;
					position: absolute;
					overflow: hidden;
				}
				#relative {
					height: 100%;
					width: 100%;
					position: relative;
				}
				#transformed {
					position: absolute;
					height: ${Math.abs(selected[0].height)}px;
					width: ${Math.abs(selected[0].width)}px;
					transform-origin: 0 0;
					transform: translate(${(selected[0].x * view.scale + view.x) / window.devicePixelRatio}px, ${(selected[0].y * view.scale + view.y) / window.devicePixelRatio}px) scale(${view.scale / window.devicePixelRatio});
				}
				#rotated {
					transform-origin: center center;
					height: 100%;
					width: 100%;
					transform: rotate(${selected[0].rotation}rad);
					pointer-events: all;
				}
			`}</style>
		</>
	);
}

function Editable({ id, element_id, value, style, align, placeholder, onChange }) {
	const div = useRef(null);

	function emitChange() {
		onChange({
			target: {
				id: id,
				value: div.current.innerText.replaceAll('\n\n', '\n'),
			},
		});
	}

	return (
		<>
			{useMemo(
				() => (
					<div
						id="wrapper"
						style={{ alignItems: align }}
						onClick={(event) => {
							event.preventDefault();
							div.current.focus();
						}}>
						<div id="editable" ref={div} style={style} onInput={emitChange} data-placeholder={placeholder} contentEditable suppressContentEditableWarning>
							{value}
						</div>
					</div>
				),
				[element_id, JSON.stringify(style), align]
			)}
			<style jsx>{`
				#wrapper {
					display: flex;
					height: 100%;
					width: 100%;
					cursor: text;
				}
				#editable {
					box-sizing: border-box;
					background: transparent;
					overflow: visible;
					word-break: break-word;
					white-space: pre-wrap;
					width: 100%;
					box-sizing: border-box;
					caret-color: black;
				}
				#editable:focus {
					outline: none;
				}
				#editable:empty:not(:focus):before {
					content: attr(data-placeholder);
					color: grey;
					pointer-events: none;
				}
				::spelling-error {
					text-decoration: wavy green underline;
				}
			`}</style>
		</>
	);
}
