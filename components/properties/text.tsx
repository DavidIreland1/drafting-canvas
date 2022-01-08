import TextInput from './inputs/text';

export default function Text({ selected, store, actions, width }) {
	const selected_ids = selected.map((element) => element.id);

	function updateText(event) {
		console.log({ [event.target.id]: event.target.value });
		store.dispatch(actions.property({ selected_ids, props: { [event.target.id]: event.target.value } }));
	}

	if (!selected[0].text) return null;

	return (
		<div id="property-container">
			<div className="property-heading">
				<h4>Text</h4>
			</div>
			<div id="properties">
				Value:
				<TextInput id="text" onChange={updateText}>
					{selected[0].text}
				</TextInput>
			</div>
			<style jsx>{`
				#properties {
					display: grid;
					grid-template-columns: auto auto;
					gap: 8px calc(${width} / 20);
					height: min-content;
					width: fit-content;
					width: 100%;
					box-sizing: border-box;
					padding: 0 10px;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
}
