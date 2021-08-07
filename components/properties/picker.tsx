export default function Picker({ store, actions, from, event, remove }) {
	function setColor(event) {
		if (!event.target.classList.contains('color')) return;
		store.dispatch(actions.setColor({ from: from, to: event.target.style.background }));
		remove();
	}

	return (
		<div id="container" onClick={setColor}>
			<div className="color" style={{ background: 'red' }} />
			<div className="color" style={{ background: 'blue' }} />
			<div className="color" style={{ background: 'orange' }} />
			<div className="color" style={{ background: 'green' }} />

			<style jsx>{`
				#container {
					position: absolute;
					top: ${event.clientX};
					left: ${event.clientY};
				}

				.color {
					width: 1em;
					height: 1em;
				}
			`}</style>
		</div>
	);
}
