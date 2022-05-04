import fs from 'fs';

export default function load(name) {
	try {
		return JSON.parse(String(fs.readFileSync('./datastate/' + name + '.json')));
	} catch (error) {
		return undefined;
	}
}
