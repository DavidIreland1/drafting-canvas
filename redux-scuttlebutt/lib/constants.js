'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
});
// keys added to the action's meta property
const META_TIMESTAMP = (exports.META_TIMESTAMP = '@@scuttlebutt/TIMESTAMP');
const META_SOURCE = (exports.META_SOURCE = '@@scuttlebutt/SOURCE');

// update and state history structure keys
const UPDATE_ACTION = (exports.UPDATE_ACTION = 0);
const UPDATE_TIMESTAMP = (exports.UPDATE_TIMESTAMP = 1);
const UPDATE_SOURCE = (exports.UPDATE_SOURCE = 2);
const UPDATE_SNAPSHOT = (exports.UPDATE_SNAPSHOT = 3);
