export default function Element({ store, actions, element, indentation, restructure }) {
	const select = (event) => {
		if (!event.shiftKey) store.dispatch(actions.unselectAll());

		if (element.selected) {
			store.dispatch(actions.unselect({ id: element.id }));
		} else {
			store.dispatch(actions.select({ select: [element.id] }));
		}
	};

	const drag = (event) => {
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
			restructure();
		};
		event.target.addEventListener('dragend', end, { once: true });
	};

	return (
		<div id="element" element-id={element.id} draggable="true" onDragStart={drag} className={(element.selected ? 'highlighted' : '') + (element.type === 'group' ? ' group' : '')}>
			<div id="label" className={element.selected ? 'selected' : ''} style={{ paddingLeft: indentation + 'px' }} onClick={select}>
				{element.label}
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
					width: 100%;
					box-sizing: border-box;
					color: var(--text-color);
					margin-left: 2px;
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
					padding: 6px 0 6px 0;
					box-sizing: border-box;
				}
				#label:hover {
					background: var(--hover);
				}
				#label.selected {
					background: var(--selected);
				}
				.highlighted > #elements {
					background: #56565b;
				}
			`}</style>
		</div>
	);
}
