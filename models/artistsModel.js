const mongoose = require('mongoose');

const artistSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			minLength: 2,
		},
		about: {
			type: String,
			trim: true,
			minLength: 5,
		},
		imageLink: {
			type: String,
			trim: true,
		},

		externelLink: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Artist', artistSchema);
