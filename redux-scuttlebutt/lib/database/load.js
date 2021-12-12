const fs = require('fs');

exports.default = function load(name) {
	try {
		return JSON.parse(fs.readFileSync('./datastate/' + name + '.json'));
	} catch (error) {
		return undefined;
	}
};
