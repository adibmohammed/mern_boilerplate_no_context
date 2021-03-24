const express = require('express');

const router = express.Router();
const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.post('/signup', (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ message: 'Email and password required!' });
	}

	User.findOne({ email })
		.then((foundUser) => {
			if (foundUser) {
				res.status(400).json({ message: 'Email already exists' });
				return;
			}

			const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

			const newUser = {
				email,
				password: hashedPassword
			};

			User.create(newUser)
				.then((createdUser) => {
					res.status(201).json({ message: 'Account successfully created' });
				})
				.catch((error) => {
					next(error);
				});
		})
		.catch((error) => {
			next(error);
		});
});

router.post('/login', (req, res, next) => {
	const { email, password } = req.body;

	User.findOne({ email })
		.then((foundUser) => {
			if (!foundUser) {
				res.status(400).json({ message: 'Bad credentials' });
			}

			const isSamePassword = bcrypt.compareSync(password, foundUser.password);
			if (!isSamePassword) {
				res.status(400).json({ message: 'Bad credentials' });
			}

			req.session.currentUser = {
				_id: foundUser._id
			};
			res.redirect('/api/current-user');
		})
		.catch((error) => {
			next(error);
		});
});

router.get('/current-user', (req, res, next) => {
	User.findById(req.session.currentUser._id)
		.select('-password')
		.then((currentUser) => {
			res.status(200).json(currentUser);
		})
		.catch((error) => {
			next(error);
		});
});

router.delete('/logout', (req, res, next) => {
	req.session.destroy(function(err) {
		// cannot access session here anymore
		if (err) {
			res.status(500).json(err);
		}
		// console.log(req.session.currentUser);
		res.sendStatus(204).json({ message: 'Successfully signed out' });
	});
});

module.exports = router;
