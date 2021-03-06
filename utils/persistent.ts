const Persistent = {
	load: (key, type: any = []) => JSON.parse(localStorage.getItem(key) ?? JSON.stringify(type)),
	save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
};

export default Persistent;
