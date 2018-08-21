// run:
// node load-bmfont.js
// to convert .fnt to .json

var fs = require('fs');
var load = require('load-bmfont');

var folder = './fonts/roboto/bitmap/';
var fileName = 'roboto-bold';

load(folder + fileName + '.fnt', function(err, font) {

	if (err) {
		throw err
	}

	// // The BMFont spec in JSON form
	// console.log(font);

	// http://stackoverflow.com/questions/2496710/writing-files-in-node-js

	fs.writeFile(folder + fileName + '.json', JSON.stringify(font), function(err) {
		if (err) {
			console.log('error', err);
			return;
		}
		console.log('generated ' + fileName + '.json');
	});

});