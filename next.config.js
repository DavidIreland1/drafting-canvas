/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const settings = {
	distDir: 'build',
	pwa: {
		dest: 'public',
		runtimeCaching,
	},
};

module.exports = process.env.NODE_ENV === 'production' ? withPWA(settings) : settings;
