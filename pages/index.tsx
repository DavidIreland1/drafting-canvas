import { generateID } from '../utils/utils';

export default function OffWhiteCanvas(): JSX.Element {
	function redirect() {
		window.location.href += generateID(20);
	}
	return <div onClick={redirect}>Redirect</div>;
}
