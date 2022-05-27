export default function User({ user }) {
	const names = user.label.split(' ');

	const abbreviation = names[0][0] + names.pop()[0];
	return (
		<div id="profile" title={user.label}>
			{abbreviation}
			<style jsx>
				{`
					#profile {
						cursor: default;
						--margin: 10px;
						font-size: 14px;
						font-weight: 300;
						width: calc(var(--nav-height) - var(--margin));
						height: calc(var(--nav-height) - var(--margin));
						margin: calc(var(--margin) / 2) 5px;
						background: ${user.color};
						box-sizing: border-box;
						border-radius: var(--nav-height);
						line-height: calc(var(--nav-height) / 2 + var(--margin) / 2);
						text-align: center;
						border: 2px solid var(--nav);
						overflow: hidden;
						color: black;
					}

					#profile:hover {
						border: 2px solid ${user.color};
					}
				`}
			</style>
		</div>
	);
}
