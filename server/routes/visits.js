const express = require('express');
const StreetArt = require('../models/StreetArt');
const Visit = require('../models/Visit');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

// Route protected for logged in user
router.get('/my-visits', isLoggedIn, async (req, res, next) => {
	// TODO: continue
	console.log("I'm the route");
	console.log(req.session.currentUser);
	Visit.find({ _user: req.session.currentUser._id }).populate('_streetArt').then((dbRes) => {
		res.json(dbRes);
		console.log(dbRes);
	});
	// You should use `.populate`
});

router.post('/visits', isLoggedIn, async (req, res, next) => {
	const newVisit = { ...req.body };
	newVisit._user = req.session.currentUser._id;

	try {
		const createdVisit = await Visit.create(newVisit);
		res.json(createdVisit).status(201);
	} catch (err) {
		next(err);
	}
});

router.delete('/visits/:visitId', isLoggedIn, async (req, res, next) => {
	const visitId = req.params.visitId;
	const visitToDelete = await Visit.findById(visitId).populate('_user');

	console.log(`visitToDelete`, visitToDelete);
	const visitOwnerId = visitToDelete._user._id;
	const visitIdUser = req.session.currentUser._id;
	// console.log(visitId);
	// res.json('coucou');

	if (visitOwnerId.toString() === visitIdUser.toString()) {
		try {
			const deletedVisit = await Visit.findByIdAndDelete(visitId);
			res.json(deletedVisit).status(200);
		} catch (err) {
			next(err);
		}
	} else {
		res.json('Unauthorized access');
	}

	// Visit.findByIdAndDelete(visitId)
	// 	.then((result) => {
	// 		res.status(201).json(result);
	// 	})
	// 	.catch((error) => {
	// 		next(error);
	// 	});
});
module.exports = router;
