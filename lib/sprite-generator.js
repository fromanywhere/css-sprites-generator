var spritesmith = require('spritesmith');
var Utils = require('../lib/utils');

module.exports = (function() {
	'use strict';

	function createCssProperties(spriteRes, spriteData) {
		var sizeMux = (spriteData.spriteScale && parseInt(spriteData.spriteScale) > 0) ? parseInt(spriteData.spriteScale) : 1;
		var result = {};

		var coords = spriteRes.coordinates || {};
		var props = spriteRes.properties ? {
			'width': spriteRes.properties.width / sizeMux,
			'height': spriteRes.properties.height / sizeMux
		} : undefined;

		Object.keys(coords).forEach(function(reference) {
			result[reference] = [
				'background-image: url(\''+ spriteData.spriteImage +'\');',
				'background-position: -'+ coords[reference].x +'px -'+ coords[reference].y +'px;',
				props ? 'background-size: '+ props.width +'px '+ props.height +'px;' : '',
			].join('\n');
		});
		return result;
	}

	function formatSpriteData(spritesmthResult, spriteData) {
		return {
			'files': spriteData.files,
			'spriteImage': spriteData.spriteImage,
			'css': createCssProperties(spritesmthResult, spriteData)
		};
	}

	function createSprite(options, spriteObj, callback) {
		options = options || {};
		spritesmith(Utils.extend(options, {
			'src': spriteObj.images
		}), function(err, result) {
			if (err || !spriteObj.spriteImage) {
				callback(err);
			} else {
				Utils.writeFileSync(spriteObj.spriteImage, result.image);
				callback(null, formatSpriteData(result, spriteObj));
			}
		});
	}

	return {
		'createSprite': createSprite
	};
})();