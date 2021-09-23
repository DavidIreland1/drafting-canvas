import { useEffect } from 'react';

import { generateID } from '../utils/utils';

export default function OffWhiteCanvas(): JSX.Element {
	useEffect(() => {
		// window.location.href += generateID(20);
	}, []);
	return <a href={(window.location.href += generateID(20))}>Redirect</a>;
}
