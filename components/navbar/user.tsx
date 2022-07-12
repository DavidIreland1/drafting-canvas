import { useEffect, useState } from 'react';

export default function User({ user }) {
	const [_user, setUser] = useState({ label: '', color: '' });

	useEffect(() => typeof window !== 'undefined' && setUser(user), [user]);

	const names = _user.label.split(' ');

	const abbreviation = names[0][0] + names.pop()[0];

	if (_user.label === '') return <></>;

	return (
		<div id="profile" title={_user.label}>
			{abbreviation}
			<style jsx>
				{`
					#profile {
						cursor: default;
						--margin: 10px;
						font-size: 14px;
						font-weight: 500;
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
						opacity: 0.8;
					}

					#profile:hover {
						opacity: 1;
					}
				`}
			</style>
		</div>
	);
}
