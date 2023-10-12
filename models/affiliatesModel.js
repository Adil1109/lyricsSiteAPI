const mongoose = require('mongoose');

const affiliateSchema = mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			minLength: 5,
		},
		description: {
			type: String,
			trim: true,
		},
		affiliateLink: {
			type: String,
			trim: true,
		},
		thumbnailLink1: {
			type: String,
			trim: true,
		},
		thumbnailLink2: {
			type: String,
			trim: true,
		},
		thumbnailLink3: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Affiliate', affiliateSchema);
