import { useState } from 'react';
import actions from '../../redux/slice';
import shortCuts from '../canvas/short-cuts';
import Chevron from '../icons/chevron';
import Eye from '../icons/eye';
import Lock from '../icons/lock';
import Text from '../inputs/text';

const open_elements = {}; // Local state that maintains on restructure

export default function Element({ store, element, indentation, restructure }) {
	const select = (event) => {
		if (element.selected) {
			store.dispatch(actions.unselect({ id: element.id }));
		} else if (event.shiftKey) {
			store.dispatch(actions.select({ id: element.id }));
		} else {
			store.dispatch(actions.selectOnly({ select: [element.id] }));
		}
	};

	function toggleVisible() {
		store.dispatch(actions.toggleVisible({ id: element.id }));
	}

	function toggleLocked() {
		store.dispatch(actions.toggleLocked({ id: element.id }));
	}

	const drag = (event) => {
		event.stopPropagation();
		const element = event.nativeEvent.composedPath().find((element) => element.id === 'element');
		event.dataTransfer.effectAllowed = 'move';
		requestAnimationFrame(() => element.classList.add('blank'));
		const move = (move_event) => {
			let hover = document.elementFromPoint(move_event.clientX, move_event.clientY);
			if (hover === element || hover === element.nextSibling) return;
			if (hover.id === 'elements') return hover.appendChild(element);
			if (hover.id === 'structure') hover.appendChild(element);
			hover = hover.parentElement;
			if (hover.id === 'element') return hover.parentElement.insertBefore(element, hover);
		};
		event.target.addEventListener('drag', move);
		const end = () => {
			element.classList.remove('blank');
			event.target.removeEventListener('drag', move);
			requestAnimationFrame(() => restructure());
		};
		event.target.addEventListener('dragend', end, { once: true });
	};

	function setHover(hover) {
		store.dispatch(actions.hoverOnly({ id: hover ? element.id : undefined }));
	}

	const [open, _setOpen] = useState(open_elements[element.id] ?? true);

	function setOpen(open) {
		open_elements[element.id] = open;
		_setOpen(open);
	}

	const [editing, setEditing] = useState(false);

	const has_children = Array.isArray(element.elements);

	return (
		<div id="element" element-id={element.id} onClick={select} draggable={!editing} onDragStart={drag} className={element.type === 'group' || element.type === 'frame' ? 'group' : ''} onKeyDown={(event) => shortCuts(event, store) && event.preventDefault()}>
			<div id="label" className={(element.selected ? 'selected' : '') + (element.hover ? ' hover' : '')} style={{ marginLeft: has_children ? 5 : indentation, gridTemplateColumns: `${has_children ? '18px' : ''} 30px auto 28px 28px` }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
				<div style={{ display: has_children ? 'block' : 'none' }}>
					<Chevron onClick={() => setOpen(!open)} rotated={open} />
				</div>

				<svg viewBox="0 0 100 100" fill="none" stroke="var(--text)" strokeWidth="2">
					<Icon type={element.type} />
				</svg>

				{editing ? (
					<Text id="props" highlight={true} onBlur={() => setEditing(false)} onChange={(event) => store.dispatch(actions.property({ selected_ids: [element.id], props: { label: event.target.value } }))}>
						{element.label}
					</Text>
				) : (
					<label onDoubleClick={() => setEditing(true)}>{element.label}</label>
				)}

				<div className={'icon ' + (element.locked ? 'visible' : '')}>
					<Lock locked={element.locked} onClick={toggleLocked} />
				</div>

				<div className={'icon ' + (element.visible ? '' : 'visible')}>
					<Eye open={element.visible} onClick={toggleVisible} />
				</div>
			</div>

			{has_children && (
				<div id="elements" className={element.selected ? 'highlighted' : ''} style={{ display: open ? '' : 'none' }} onDragOver={(event) => event.preventDefault()}>
					{element.elements.map((child) => (
						<Element key={child.id} element={child} indentation={20} store={store} restructure={restructure} />
					))}
				</div>
			)}
			<style jsx>{`
				#element {
					width: calc(100% - 2px);
					box-sizing: border-box;
					color: var(--text);
					box-sizing: border-box;
					border-radius: var(--radius);
				}
				#element.group,
				#element.frame {
					border-left: 3px solid var(--hover);
				}
				#element:active {
					cursor: default !important; //not working
				}
				#element.blank {
					opacity: 0;
				}
				#element.blank > *,
				#element.blank > * > * {
					border: none;
					visibility: collapse !important;
				}
				#elements {
					padding-bottom: 5px;
					border-radius: var(--radius);
					margin: 4px 0 8px 8px;
				}
				#label {
					display: grid;
					box-sizing: border-box;
					padding: 2px 3px;
					border-radius: var(--radius);
					margin: 4px 0 4px 2px;
					overflow: hidden;
				}
				#label > label {
					padding: 5px 2px 5px 2px;
					border-bottom: 1px solid transparent;
				}
				#label:hover,
				#label.hover {
					background-color: var(--hover);
				}
				#label.selected {
					background-color: var(--selected);
				}
				.highlighted > div > #label {
					background-color: var(--hover);
				}
				.icon {
					fill: var(--icon);
					stroke: var(--icon);
					z-index: 2;
					visibility: hidden;
				}
				.icon.visible,
				.selected > .icon,
				.hover > .icon {
					visibility: visible;
				}
				svg {
					padding: 2px;
				}
			`}</style>
		</div>
	);
}

function Icon({ type }) {
	switch (type) {
		case 'rectangle':
			return (
				<>
					<title>Rectangle</title>
					<rect x="20" y="20" width="60" height="60" />
				</>
			);
		case 'group':
			return (
				<>
					<title>Group</title>
					<rect x="20" y="20" width="60" height="60" strokeDasharray="12" strokeWidth="2" />
				</>
			);
		case 'ellipse':
			return (
				<>
					<title>Ellipse</title>
					<circle cx="50" cy="50" r="30" />
				</>
			);
		case 'line':
			return (
				<>
					<title>Line</title>
					<rect x="15" y="15" width="15" height="15" />
					<line x1="30" y1="30" x2="70" y2="70" />
					<rect x="70" y="70" width="15" height="15" />
				</>
			);
		case 'text':
			return (
				<>
					<title>Text</title>
					<line x1="20" y1="20" x2="80" y2="20" />
					<line x1="50" y1="20" x2="50" y2="80" />
				</>
			);
		// case 'spline':
		// 	return (
		// 		<>
		// 			<title>Spline</title>
		// 			<rect x="15" y="15" width="15" height="15" />
		// 			<path d="M 22.5 30 C 22.5 70, 77.5 30, 77.5 70 " />
		// 			<rect x="70" y="70" width="15" height="15" />
		// 		</>
		// 	);

		default:
			return <></>;
	}
}
