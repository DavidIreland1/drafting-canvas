import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import actions from '../../redux/slice';
import { RootState } from '../../redux/store';
import Colors from './../properties/colors';
import Text from './elements/text';

export default function TextLayer({ canvas, user_id, store }) {
	const editing = useSelector(
		(state) => (state as RootState).present.elements.filter((element) => element.editing),
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);
	const view = useSelector(
		(state) => (state as RootState).present.views.find((view) => view.id === user_id),
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	if (editing.length === 0 || editing[0].type !== 'text' || typeof view === 'undefined') return null;

	const text = editing[0];

	function updateText(event, alter = (value) => value) {
		store.dispatch(actions.property({ selected_ids: [text.id], props: { [event.target.id]: [alter(event.target.value), 0] } }));
	}

	const bounds = Text.bound(text);

	const style = {
		fontFamily: text.family,
		textAlign: text.justify,
		fontSize: Math.abs(text.size) + 'px',
		fontWeight: text.weight,
		fontStyle: text.style,
		lineHeight: text.line_height,
		color: Colors.toString(text.fill[0]?.color || [0, 0, 0, 0]),
	};

	const transformed = {
		height: Math.abs(bounds.height) + 'px',
		width: Math.abs(bounds.width) + 'px',
		transform: `translate(${(bounds.x * view.scale + view.x) / window.devicePixelRatio}px, ${(bounds.y * view.scale + view.y) / window.devicePixelRatio}px) scale(${view.scale / window.devicePixelRatio})`,
	};

	const rotated = {
		transform: `rotate(${text.rotation}rad)`,
	};

	return (
		<div id="container">
			<div id="relative">
				<div id="transformed" style={transformed}>
					<div id="rotated" style={rotated}>
						<Editable id="text" canvas={canvas} element_id={text.id} style={style} align={text.align} value={text.text === 'Text...' ? null : text.text} onChange={updateText} />
					</div>
				</div>
			</div>

			<style jsx>{`
				div {
					height: 100%;
					width: 100%;
				}
				#container {
					pointer-events: none;
					position: absolute;
					overflow: hidden;
				}
				#relative {
					position: relative;
					overflow: hidden;
				}
				#transformed {
					position: absolute;
					transform-origin: 0 0;
				}
				#rotated {
					transform-origin: center center;
					pointer-events: all;
				}
			`}</style>
		</div>
	);
}

function Editable({ id, canvas, element_id, value, style, align, placeholder = '', onChange }) {
	const div = useRef(null);

	const container = useRef(null);

	useEffect(() => {
		function propagateWheel(event: WheelEvent) {
			event.preventDefault();
			canvas.current.dispatchEvent(new WheelEvent(event.type, event));
		}
		container.current?.addEventListener('wheel', propagateWheel);
	}, [canvas, container]);

	function updateText() {
		onChange({ target: { id: id, value: removeLastBreak(div.current.innerText) } });
	}

	function removeLastBreak(text) {
		return text.replaceAll('\n\n', '\n');
		// return text
		// 	.split('\n')
		// 	.filter((line, i, lines) => !(i < lines.length && line === '\n' && lines[i + 1] !== '\n'))
		// 	.join('\n');
	}

	useEffect(() => {
		window.getSelection().selectAllChildren(div.current);
	}, []);

	const style_string = JSON.stringify(style);

	return (
		<>
			{useMemo(
				() => (
					<div id="wrapper" ref={container} style={{ alignItems: align }} onClick={() => div.current.focus()}>
						<div id="editable" ref={div} style={style} onInput={updateText} data-placeholder={placeholder} contentEditable suppressContentEditableWarning>
							{value}
						</div>
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
					</div>
				),
				// eslint-disable-next-line react-hooks/exhaustive-deps
				[element_id, style_string, align]
			)}
		</>
	);
}
