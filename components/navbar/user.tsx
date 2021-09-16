export default function User({ user }) {
	return (
		<>
			<div id="profile" title={user.label}>
				{user.label.replace(/[^A-Z]/g, '')}
			</div>

			<style jsx>
				{`
					#profile {
						cursor: default;
						--margin: 16px;
						font-size: 12px;
						width: calc(var(--nav-height) - var(--margin));
						height: calc(var(--nav-height) - var(--margin));
						margin: calc(var(--margin) / 2) 5px;
						background: ${user.color};
						box-sizing: border-box;
						border-radius: var(--nav-height);
						line-height: calc(var(--nav-height) - var(--margin) - 2px);
						text-align: center;
						border: 1px solid black;
						overflow: hidden;
						color: black;
					}

					#profile:hover {
						border: 1px solid ${user.color};
					}
				`}
			</style>
		</>
	);
}
