export default function Element(props) {
	const { store, actions, element, indentation } = props;

	const select = (event) => {
		if (!event.shiftKey) store.dispatch(actions.unselectAll());

		if (element.selected) {
			store.dispatch(actions.unselect({ id: element.id }));
		} else {
			store.dispatch(actions.select({ select: [element.id] }));
		}
	};

	return (
		<div id="element" className={element.selected ? 'highlighted' : ''}>
			<div id="label" className={element.selected ? 'selected' : ''} style={{ paddingLeft: indentation + 'px' }} onClick={select}>
				{element.label}
			</div>

			{element.type === 'group' ? (
				<div id="elements">
					{element.elements.map((child) => (
						<Element key={child.id} element={child} indentation={indentation + 15} store={store} actions={actions}></Element>
					))}
				</div>
			) : undefined}
			<style jsx>{`
				#element {
					width: 100%;
					box-sizing: border-box;
					// border: 1px solid transparent;
					color: var(--text-color);
				}

				#elements {
					// border-left: 3px solid white;
					// padding-left: 5px;
				}

				#label {
					padding: 8px 0 8px 0;
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
