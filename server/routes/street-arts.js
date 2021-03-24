// server/routes/street-arts.js
const express = require('express');
const StreetArt = require('./../models/StreetArt.js');
const router = express.Router();
const uploader = require('./../configs/cloudinary.js');

router.get('/', (req, res, next) => {
	// TODO
	StreetArt.find()
		.then((art) => {
			res.json(art);
		})
		.catch((err) => next(err));
});

router.get('/:id', (req, res, next) => {
	// TODO
	const id = req.params.id;
	StreetArt.findById(id)
		.then((art) => {
			res.json(art);
		})
		.catch((err) => next(err));
});

// Route to create a street art
// `uploader.single('picture')` parses the data send with the name `picture` and save information inside `req.file`
router.post('/', uploader.single('picture'), async (req, res, next) => {
	let { lat, lng } = req.body;
	let pictureUrl;

	if (req.file) {
		pictureUrl = req.file.path;
	}

	// TODO: continue
	try {
		await StreetArt.create({
			location: { coordinates: [ lat, lng ] },

			pictureUrl
		});
		res.json({
			success: true
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
