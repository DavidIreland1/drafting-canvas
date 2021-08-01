export default function Navbar() {
	return (
		<div id="container">
			<div id="bar">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
					<path d="M 30 15 l 0 70 l 20 -15 l 32 -3 L 30 15" />
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
					<rect x="20" y="20" width="60" height="60" />
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
					<rect x="15" y="15" width="15" height="15" />
					<line x1="30" y1="30" x2="70" y2="70" />
					<rect x="70" y="70" width="15" height="15" />
				</svg>
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
					<circle cx="50" cy="50" r="30" />
				</svg>
			</div>

			<style jsx>{`
				#container {
					background: #212123;
				}
				#bar {
					height: 100%;
					width: var(--nav-height);
					color: var(--text-color);
					padding: 6px;
					box-sizing: border-box;
					display: grid;
					grid-gap: 10px;
					height: fit-content;
				}
				img,
				svg {
					height: var(--nav-height);
					width: var(--nav-height);
				}
				svg {
					width: 100%;
					height: calc(var(--nav-height) - 12px)
					cursor: pointer;
					fill: none;
					stroke: white;
					padding: 2px;
					stroke-width: 5;
					margin: auto;
					border-radius: 4px;
				}

				svg:hover {
					background: var(--hover);
				}
			`}</style>
		</div>
	);
}
