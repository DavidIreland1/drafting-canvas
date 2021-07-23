export default function Navbar() {
	return (
		<div>
			<div id="nav">
				<img src="/images/offwhite.svg" />
				<div id="title">OFF WHITE CANVAS</div>
			</div>

			<style jsx>{`
				#nav {
					display: grid;
					grid-auto-flow: column;
					grid-template-columns: min-content;
					height: var(--nav-height);
					background: var(--nav-background);
					color: var(--text-color);
				}
				img {
					height: var(--nav-height);
					width: var(--nav-height);
					padding: 2px;
				}
				#title {
					height: var(--nav-height);
					padding: 0 10px;
					line-height: var(--nav-height);
					font-weight: 200;
					font-size: calc(var(--nav-height) / 2);
				}
			`}</style>
		</div>
	);
}
