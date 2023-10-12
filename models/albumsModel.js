const mongoose = require('mongoose');

const albumSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			minLength: 2,
		},
		description: {
			type: String,
			trim: true,
			minLength: 5,
		},
		thumbnailLink: {
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

module.exports = mongoose.model('Album', albumSchema);
