const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
	{
		_user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		_streetArt: {
			type: Schema.Types.ObjectId,
			ref: 'StreetArt'
		}
	},
	{
		timestamps: {
			createdAt: 'createdAt'
		}
	}
);

module.exports = mongoose.model('Visit', schema);
