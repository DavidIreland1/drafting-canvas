import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import actions from '../../redux/slice';
import { RootState } from '../../redux/store';
import Colors from './../properties/colors';

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
		store.dispatch(actions.property({ selected_ids: [text.id], props: { [event.target.id]: alter(event.target.value) } }));
	}

	const style = {
		fontFamily: text.family,
		textAlign: text.justify,
		fontSize: Math.abs(text.size) + 'px',
		fontWeight: text.weight,
		fontStyle: text.style,
		lineHeight: text.line_height,
		color: Colors.toString(text.fill[0].color),
	};

	const transformed = {
		height: Math.abs(text.height) + 'px',
		width: Math.abs(text.width) + 'px',
		transform: `translate(${(text.x * view.scale + view.x) / window.devicePixelRatio}px, ${(text.y * view.scale + view.y) / window.devicePixelRatio}px) scale(${view.scale / window.devicePixelRatio})`,
	};

	const rotated = {
		transform: `rotate(${text.rotation}rad)`,
	};
	function propagateWheel(event) {
		// event.preventDefault();
		canvas.current.dispatchEvent(new event.nativeEvent.constructor(event.type, event));
	}

	return (
		<>
			<div id="container" onWheel={propagateWheel}>
				<div id="relative">
					<div id="transformed" style={transformed}>
						<div id="rotated" style={rotated}>
							<Editable id="text" element_id={text.id} style={style} align={text.align} value={text.text === 'Text...' ? null : text.text} onChange={updateText} />
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
					overflow: hidden;
				}
				#transformed {
					position: absolute;
					transform-origin: 0 0;
				}
				#rotated {
					transform-origin: center center;
					height: 100%;
					width: 100%;
					pointer-events: all;
				}
			`}</style>
		</>
	);
}

function Editable({ id, element_id, value, style, align, placeholder = '', onChange }) {
	const div = useRef(null);

	function updateText() {
		onChange({ target: { id: id, value: div.current.innerText.replaceAll('\n\n', '\n') } });
	}

	useEffect(() => {
		window.getSelection().selectAllChildren(div.current);
	}, []);

	return (
		<>
			{useMemo(
				() => (
					<div id="wrapper" style={{ alignItems: align }} onClick={() => div.current.focus()}>
						<div id="editable" ref={div} style={style} onInput={updateText} data-placeholder={placeholder} contentEditable suppressContentEditableWarning>
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
