import { hover } from '../canvas/interaction';

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
		console.log(event.target);
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

	function setHover(hover_state) {
		store.dispatch(actions.hoverOnly({ id: element.id }));
	}

	return (
		<div id="element" element-id={element.id} draggable="true" onDragStart={drag} className={(element.selected ? 'highlighted' : '') + (element.type === 'group' ? ' group' : '')}>
			<div id="label" className={(element.selected ? 'selected' : '') + (element.hover ? ' hover' : '')} style={{ paddingLeft: indentation + 'px' }} onMouseEnter={setHover} onMouseLeave={setHover}>
				<label onClick={select}>{element.label}</label>
				<svg viewBox="0 0 100 100" className={element.locked ? 'locked' : 'unlocked'} onClick={toggleLocked}>
					<path className="locked" d="M 35 50 L 35 30 A 50 200 0 0 1 70 30 L 70 50" strokeWidth="8" fill="none" />
					<rect className="locked" x="30" y="50" width="45" height="35"></rect>
					<path className="unlocked" d="M 05 50 L 05 30 A 50 200 0 0 1 40 30 L 40 50" strokeWidth="8" fill="none" />
					<rect className="unlocked" x="30" y="50" width="45" height="35"></rect>
				</svg>
				<svg viewBox="0 0 100 100" className={element.visible ? 'visible' : 'hidden'}>
					<path className="visible" d="M 5 50 A 50 40 0 0 1 95 50 " strokeWidth="5" fill="none" />
					<circle className="visible" cx="50" cy="50" r="13"></circle>
					<path className="visible" d="M 5 50 A 50 40 0 0 0 95 50 " strokeWidth="5" fill="none" />
					<path className="hidden" d="M 5 50 A 50 40 0 0 0 95 50 " strokeWidth="5" fill="none" />
					<line className="hidden" x1="15" y1="63" x2="5" y2="83" strokeWidth="5"></line>
					<line className="hidden" x1="40" y1="70" x2="35" y2="90" strokeWidth="5"></line>
					<line className="hidden" x1="60" y1="70" x2="65" y2="90" strokeWidth="5"></line>
					<line className="hidden" x1="85" y1="63" x2="95" y2="83" strokeWidth="5"></line>
					<rect width="100" height="100" fill="white" stroke="none" fillOpacity="0" onClick={toggleVisible}></rect>
				</svg>
			</div>

			{element.type === 'group' ? (
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
				#element.group {
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
					grid-template-columns: auto 18px 18px;
					grid-gap: 10px;
					padding: 6px 8px 6px 0;
					box-sizing: border-box;
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

				#label > svg {
					width: 18px;
					height: 18px;
					fill: var(--off-white);
					stroke: var(--off-white);
					z-index: 2;
				}
				#label > svg > * {
					display: none;
				}
				#label:hover > svg > *,
				#label.hover > svg > * {
					display: block;
				}

				svg.locked > .locked,
				svg.hidden > .hidden {
					display: block !important;
				}

				svg.unlocked > .locked,
				svg.hidden > .visible,
				svg.locked > .unlocked,
				svg.visible > .hidden {
					display: none !important;
				}
			`}</style>
		</div>
	);
}
