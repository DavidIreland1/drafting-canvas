import { useEffect } from 'react';

import { generateID } from '../utils/utils';

export default function OffWhiteCanvas(): JSX.Element {
	useEffect(() => {
		open(window.location + generateID(20), '_self');
	}, []);
	return <div>Redirect</div>;
}
