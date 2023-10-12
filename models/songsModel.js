const mongoose = require('mongoose');

const songSchema = mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			minLength: 5,
		},
		lyrics: {
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

		albumId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
		artistId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Song', songSchema);
