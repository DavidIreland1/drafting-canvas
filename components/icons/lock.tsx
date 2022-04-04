export default function Lock({ locked = true, onClick = undefined }) {
	return (
		<div onMouseDown={onClick}>
			<svg viewBox="0 0 100 100" className={locked ? 'locked' : 'unlocked'}>
				<path className="locked" d="M 35 50 L 35 30 A 50 200 0 0 1 70 30 L 70 50" strokeWidth="8" fill="none" />
				<rect className="locked" x="30" y="50" width="45" height="35"></rect>
				<path className="unlocked" d="M 05 50 L 05 30 A 50 200 0 0 1 40 30 L 40 50" strokeWidth="8" fill="none" />
				<rect className="unlocked" x="30" y="50" width="45" height="35"></rect>
			</svg>

			<style jsx>{`
				svg,
				div {
					width: 100%;
					height: 100%;
					fill: var(--icon);
					stroke: var(--icon);
					z-index: 2;
					display: block;
				}

				svg.locked > .locked {
					display: block !important;
				}

				svg.unlocked > .locked,
				svg.locked > .unlocked {
					display: none !important;
				}

				div {
					padding: 5px;
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
