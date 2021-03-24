const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const StreetArt = require('../models/StreetArt');
const Visit = require('../models/Visit');

const bcryptSalt = 10;

require('../configs/database');

let userDocs = [
	new User({
		email: 'alice@gmail.com',
		password: bcrypt.hashSync('alice', bcrypt.genSaltSync(bcryptSalt))
	}),
	new User({
		email: 'bob@gmail.com',
		password: bcrypt.hashSync('bob', bcrypt.genSaltSync(bcryptSalt))
	})
];

let streetArtDocs = [
	new StreetArt({
		pictureUrl: 'https://lh5.googleusercontent.com/p/AF1QipNqlBgeyUgKqGUH_oYogtxRQ0KPTtLAgiCXEUon',
		location: {
			type: 'Point',
			coordinates: [ -9.209744, 38.69606 ]
		}
	}),
	new StreetArt({
		pictureUrl: 'https://lh5.googleusercontent.com/p/AF1QipO_kynLt94FYjYKmstOul5mZ-fnXyb6O_2Kr7SL',
		location: {
			type: 'Point',
			coordinates: [ -9.136864, 38.720205 ]
		}
	}),
	new StreetArt({
		pictureUrl: 'https://lh5.googleusercontent.com/p/AF1QipONkHmWhUjFjelUXxlekBg1Aq0ccW20yXxBRxxQ',
		location: {
			type: 'Point',
			coordinates: [ 13.451661, 52.507734 ]
		}
	})
];

let visitDocs = [
	new Visit({
		_user: userDocs[0]._id,
		_streetArt: streetArtDocs[0]._id
	}),
	new Visit({
		_user: userDocs[0]._id,
		_streetArt: streetArtDocs[1]._id
	}),
	new Visit({
		_user: userDocs[1]._id,
		_streetArt: streetArtDocs[0]._id
	})
];

Promise.all([ User.deleteMany(), StreetArt.deleteMany(), Visit.deleteMany() ])
	.then(() => {
		console.log('All users, street arts and visits have been deleted');

		return Promise.all([ User.create(userDocs), StreetArt.create(streetArtDocs), Visit.create(visitDocs) ]);
	})
	.then(() => {
		console.log(`${userDocs.length} users created`);
		console.log(`${streetArtDocs.length} street arts created`);
		console.log(`${visitDocs.length} visits created`);
		mongoose.disconnect();
	})
	.catch((err) => {
		mongoose.disconnect();
		throw err;
	});
