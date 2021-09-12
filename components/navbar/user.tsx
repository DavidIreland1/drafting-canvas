export default function User({ user }) {
	console.log(user);
	return (
		<>
			<div id="profile" title={user.label}>
				{user.label
					.split(' ')
					.map((name) => name[0])
					.join('')}
			</div>

			<style jsx>
				{`
					#profile {
						--margin: 16px;
						font-size: 12px;
						width: calc(var(--nav-height) - var(--margin));
						height: calc(var(--nav-height) - var(--margin));
						margin: calc(var(--margin) / 2) 5px;
						background: ${user.color};
						box-sizing: border-box;
						border-radius: var(--nav-height);
						line-height: calc(var(--nav-height) - var(--margin));
						text-align: center;
						border: 1px solid white;
						overflow: hidden;
					}
				`}
			</style>
		</>
	);
}
