export default function Chevron({ onClick = undefined, rotated = false }) {
	return (
		<div onMouseDown={onClick}>
			<svg viewBox="0 0 10 10" stroke="var(--icon)" strokeWidth="1" style={{ transform: rotated ? 'rotate(90deg)' : '' }}>
				<line x1="2" y1="0" x2="8" y2="5" />
				<line x1="8" y1="5" x2="2" y2="10" />
			</svg>

			<style jsx>{`
				svg,
				div {
					display: block;
					width: 100%;
					height: 100%;
					transform-origin: center center;
					transition: transform 500ms;
				}

				div {
					padding: 4px;
					margin: auto;
					border-radius: 6px;
					box-sizing: border-box;
				}
				div:hover {
					background: var(--nav);
				}
			`}</style>
		</div>
	);
}
