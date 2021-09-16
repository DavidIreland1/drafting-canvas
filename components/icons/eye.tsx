export default function Eye({ open = true, onClick = undefined }) {
	return (
		<div onMouseDown={onClick}>
			<svg viewBox="0 0 100 100" className={open ? 'open' : 'closed'}>
				<path className="open" d="M 5 50 A 50 40 0 0 1 95 50 " strokeWidth="5" fill="none" />
				<circle className="open" cx="50" cy="50" r="13"></circle>
				<path className="open" d="M 5 50 A 50 40 0 0 0 95 50 " strokeWidth="5" fill="none" />
				<path className="closed" d="M 5 50 A 50 40 0 0 0 95 50 " strokeWidth="5" fill="none" />
				<line className="closed" x1="15" y1="63" x2="5" y2="83" strokeWidth="5"></line>
				<line className="closed" x1="40" y1="70" x2="35" y2="90" strokeWidth="5"></line>
				<line className="closed" x1="60" y1="70" x2="65" y2="90" strokeWidth="5"></line>
				<line className="closed" x1="85" y1="63" x2="95" y2="83" strokeWidth="5"></line>
			</svg>

			<style jsx>{`
				svg,
				div {
					display: block;
					width: 100%;
					height: 100%;
					fill: var(--off-white);
					stroke: var(--off-white);
					z-index: 2;
				}

				svg.closed > .closed {
					display: block !important;
				}

				svg.closed > .open,
				svg.open > .closed {
					display: none !important;
				}

				div {
					padding: 5px;
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
