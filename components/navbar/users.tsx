import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import User from './user';

export default function Users() {
	const users = useSelector(
		(state) => (state as RootState).present.cursors,
		(a, b) => JSON.stringify(a) === JSON.stringify(b)
	);

	return (
		<>
			<div id="users">
				{users.map((user, i) => (
					<User key={i} user={user} />
				))}
			</div>

			<style jsx>{`
				#users {
					display: grid;
					grid-auto-flow: column;
				}
			`}</style>
		</>
	);
}
