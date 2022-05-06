import { useState, useEffect, useRef } from 'react';

export default function useIsVisible(initialIsVisible) {
	const [isVisible, setIsVisible] = useState(initialIsVisible);
	const ref = useRef(null);

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [ref]);

	return [ref, isVisible, setIsVisible];
}
