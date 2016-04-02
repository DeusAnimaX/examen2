// Song model

'use strict';

let mongoose = require('mongoose'),
		Schema = mongoose.Schema;

let	SongSchema = new Schema({
	name: String,
	artist: String,
	year: String,
	genre: String,
	path: String,
	playlist: String
});

module.exports = mongoose.model('Song', SongSchema);


