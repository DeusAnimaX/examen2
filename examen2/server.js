'use strict';

// server.js (Express 4.0)

// BASE SETUP
// ==============================================

// call the packages we need
let express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		dbURI = 'mongodb://localhost/playlist',
		port = process.env.PORT || 8080;

// connect to mongodb
mongoose.connect(dbURI);

// 
let Song = require('./app/api/models/song');


// DEFINE THE MIDDLEWARE FOR APP
// ==============================================

// configure app to use bodyParser()
// this will let us get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES
// ==============================================

// get an instance of the express router
let apiRouter = express.Router();

// test router
// apiRouter.get('/', (req, res) => {
// 	res.json({ message: 'welcome to out api' });
// });

// MIDDLEWARE to use for all requests
apiRouter.use((req, res, next) => {
	// do something before running routes
	console.log('Happening before routes...');
	next();   // don't stop here, go to next route
});

// routes 
// generic root route of the api
apiRouter.get('/', (req, res) => {
	res.json({ message: 'Hello API!' });
});

// on routes that end in /songs
apiRouter.route('/songs')
	// create a song (http://localhost:8080/api/songs)
	.post((req, res) => {
		let song = new Song();

		song.name = req.body.name;
		song.artist = req.body.artist;
		song.year = req.body.year;
		song.genre = req.body.genre;
		song.path = req.body.path;
		song.playlist = req.body.playlist;

		song.save(err => {
			if (err) res.send(err);
			res.json({ message: 'song created!' });
		});
	})
	// get all songs (http://localhost:8080/api/songs)
	.get((req, res) => {
		Song.find((err, songs) => {
			if (err) res.send(err);
			res.json(songs);
		});
	});

// on routes that end in /songs/:song_id
apiRouter.route('/songs/:song_id')
	// get a song by id (http://localhost:8080/api/songs/:song_id)
	.get((req, res) => {
		Song.findById(req.params.song_id, (err, song) => {
			if (err) res.send(err);
			res.json(song);
		});
	})
	// update a song by id (http://localhost:8080/api/songs/:song_id)
	.put((req, res) => {
		Song.findById(req.params.song_id, (err, song) => {
			if (err) res.send(err);
			// update info
			song.name = req.body.name;
			song.artist = req.body.artist;
			song.year = req.body.year;
			song.genre = req.body.genre;
			song.path = req.body.path;
			song.playlist = req.body.playlist;
			// save song
			song.save(err => {
				if (err) res.send(err);
				res.json({ message: 'song updated!' });
			});
		});
	})
	// delete a song by id (http://localhost:8080/api/songs/:song_id)
	.delete((req, res) => {
		Song.remove({ _id: req.params.song_id }, (err, song) => {
			if (err) res.send(err);
			res.json({ message: 'Successfully deleted!'});
		});
	});

// Search methods
// ==============================================

// on routes that end in /songs/search/artist/:artist
apiRouter.route('/songs/search/artist/:artist')
	// get all songs by artist (http://localhost:8080/api/songs/search/artist/:artist)
	.get((req, res) => {
		Song.find({'artist':req.params.artist}, (err, songs) => {
			if (err) res.send(err);
			res.json(songs);
		});
	});

// on routes that end in /songs/search/name/:name
apiRouter.route('/songs/search/name/:name')
	// get all songs by name (http://localhost:8080/api/songs/search/name/:name)
	.get((req, res) => {
		Song.find({'name':{'$regex':req.params.name}}, (err, songs) => {
			if (err) res.send(err);
			res.json(songs);
		});
	});

// ==============================================

// on routes that end in /songs/copy/:song_id/:playlist_name
apiRouter.route('/songs/copy/:song_id/:playlist_name')
	// copy song to playlist (http://localhost:8080/api/songs/copy/:song_id/:playlist_name)
	.get((req, res) => {
		Song.findById(req.params.song_id, (err, song) => {
			if (err) res.send(err);
			
			let newSong = new Song();

			newSong.name = song.name;
			newSong.artist = song.artist;
			newSong.year = song.year;
			newSong.genre = song.genre;
			newSong.path = song.path;
			newSong.playlist = req.params.playlist_name;

			newSong.save(err => {
				if (err) res.send(err);
				res.json({ message: 'song copied to '+req.params.playlist_name+'!' });
			});
		});
	});

// register our routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);



// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
