// var log = console.log;
// console.log = function () {
// 	log.apply(console, arguments);
// 	console.trace();
// 	log('\n\n\n')
// };

const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// config.node = {
		// 	fs: 'empty',
		// };

		config.plugins.push(
			new WasmPackPlugin({
				// args: '--log-level warn',
				// forceMode: 'production',
				crateDirectory: path.resolve(__dirname, '.'),
				// pluginLogLevel: 'error',
			})
		);
		return config;
	},
};
