import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { generateID } from '../../utils/utils';

export default function Index() {
	const router = useRouter();

	useEffect(() => {
		router.push('/canvas/' + generateID());
	}, [router]);

	return <></>;
}
