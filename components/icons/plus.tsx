export default function Plus({ onClick = undefined }) {
	return (
		<div onMouseDown={onClick}>
			<svg viewBox="0 0 10 10" stroke="white" strokeWidth="0.8">
				<line x1="0" y1="5" x2="10" y2="5" />
				<line x1="5" y1="0" x2="5" y2="10" />
			</svg>

			<style jsx>{`
				svg,
				div {
					display: block;
					width: 100%;
					height: 100%;
				}

				div {
					padding: 7px;
					margin: auto;
					border-radius: 6px;
					box-sizing: border-box;
				}
				div:hover {
					background: var(--hover);
				}
			`}</style>
		</div>
	);
}
