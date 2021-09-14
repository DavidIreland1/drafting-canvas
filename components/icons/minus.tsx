export default function Minus({ onClick }) {
	return (
		<div onMouseDown={onClick}>
			<svg viewBox="0 0 10 10" stroke="white" strokeWidth="0.8">
				<line x1="0" y1="5" x2="10" y2="5" />
			</svg>

			<style jsx>{`
				svg,
				div {
					width: 100%;
					height: 100%;
					display: block;
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
