const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('./configs/database');

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL, // Allow different domain to communicate with API
		optionsSuccessStatus: 200,
		credentials: true // Accept cookies from different domain
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable authentication using session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);

app.use('/api', require('./routes/auth'));
app.use('/api/countries', require('./routes/countries'));
app.use('/api/street-arts', require('./routes/street-arts'));
app.use('/api', require('./routes/auth.js'));
app.use('/api', require('./routes/visits'));

// For any routes that starts with "/api", catch 404 and forward to error handler
app.use('/api/*', (req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => {
	console.error('----- An error happened -----');
	console.error(err);

	// only render if the error ocurred before sending the response
	if (!res.headersSent) {
		res.status(err.status || 500);

		// A limited amount of information sent in production
		if (process.env.NODE_ENV === 'production') res.json(err);
		else res.json(JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err))));
	}
});

module.exports = app;
