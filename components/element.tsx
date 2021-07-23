import stores from './../redux/stores';
import actions from './../reducers/actions';

export default function Element(props) {
	const { element, indentation } = props;

	const select = () => {
		console.log(element.id);

		if (element.selected) {
			stores.elements.dispatch(actions.unselect({ id: element.id }));
		} else {
			stores.elements.dispatch(actions.select({ id: element.id }));
		}
	};

	return (
		<div id="element">
			<div id="label" className={element.selected ? 'selected' : ''} style={{ paddingLeft: indentation + 'px' }} onClick={select}>
				{element.label}
			</div>

			{element.type === 'group' ? (
				<div id="elements">
					{element.elements.map((child) => (
						<Element key={child.id} element={child} indentation={indentation + 20}></Element>
					))}
				</div>
			) : undefined}
			<style jsx>{`
				#element {
					width: 100%;
					box-sizing: border-box;
					border: 1px solid transparent;
				}
				.selected {
					background: #9a9ad0 !important;
				}

				#label {
					padding: 8px 0 8px 0;
				}
				#label:hover {
					background: #84888e;
				}
			`}</style>
		</div>
	);
}
