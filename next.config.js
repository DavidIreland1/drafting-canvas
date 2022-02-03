const path = require('path');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		config.node = {
			fs: 'empty',
		};

		config.plugins.push(
			new WasmPackPlugin({
				crateDirectory: path.resolve(__dirname, '.'),
			})
		);
		return config;
	},
};
