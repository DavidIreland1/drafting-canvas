import { hover } from '../canvas/interaction';
import Eye from '../icons/eye';
import Lock from '../icons/lock';

export default function Element({ store, actions, element, indentation, restructure }) {
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
		requestAnimationFrame(() => {
			element.classList.add('blank');
		});
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

	function setHover() {
		store.dispatch(actions.hoverOnly({ id: element.id }));
	}

	return (
		<div id="element" element-id={element.id} draggable="true" onDragStart={drag} className={(element.selected ? 'highlighted' : '') + (element.type === 'group' || element.type === 'frame' ? ' group' : '')}>
			<div id="label" className={(element.selected ? 'selected' : '') + (element.hover ? ' hover' : '')} style={{ paddingLeft: indentation + 'px' }} onMouseEnter={setHover} onMouseLeave={setHover}>
				<label onClick={select}>{element.label}</label>

				<div className={'icon ' + (element.locked ? ' visible' : '')}>
					<Lock locked={element.locked} onClick={toggleLocked} />
				</div>

				<div className={'icon ' + (element.visible ? '' : ' visible')}>
					<Eye open={element.visible} onClick={toggleVisible} />
				</div>
			</div>

			{element.type === 'group' || element.type === 'frame' ? (
				<div id="elements" onDragOver={(event) => event.preventDefault()}>
					{element.elements.map((child) => (
						<Element key={child.id} element={child} indentation={indentation + 15} store={store} actions={actions} restructure={restructure} />
					))}
				</div>
			) : undefined}
			<style jsx>{`
				#element {
					width: calc(100% - 2px);
					box-sizing: border-box;
					color: var(--text-color);
					margin-left: 2px;
					box-sizing: border-box;
				}
				#element.group,
				#element.frame {
					border-left: 3px solid var(--selected);
				}
				#element:active {
					cursor: default !important; //not working
				}
				#element.blank > * {
					visibility: collapse;
					border: none;
				}
				#elements {
					padding-bottom: 5px;
				}

				#label {
					display: grid;
					grid-template-columns: auto 28px 28px;
					box-sizing: border-box;
					padding: 2px 4px;
				}
				#label > label {
					padding: 6px 4px 6px 0;
				}
				#label:hover,
				#label.hover {
					background: var(--hover);
				}
				#label.selected {
					background: var(--selected);
				}
				.highlighted > #elements {
					background: #56565b;
				}

				.icon {
					fill: var(--off-white);
					stroke: var(--off-white);
					z-index: 2;
					visibility: hidden;
				}

				.icon.visible,
				.selected > .icon,
				.hover > .icon {
					visibility: visible;
				}
			`}</style>
		</div>
	);
}
