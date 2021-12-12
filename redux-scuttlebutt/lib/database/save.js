const fs = require('fs');

exports.default = function save(name, data) {
	fs.writeFile('./datastate/' + name + '.json', JSON.stringify(data, null, '\t'), 'utf8', () => {});
};
