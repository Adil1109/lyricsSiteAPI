const Affiliate = require('../models/affiliatesModel');
const Joi = require('joi');

exports.getAffiliate = async (req, res) => {
	const { _id } = req.params;
	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Affiliate id not found!' });
		}

		const existingAffiliate = await Affiliate.findOne({ _id });

		if (!existingAffiliate) {
			return res
				.status(400)
				.json({ success: false, message: 'Affiliate is already unavailable!' });
		}

		res.status(200).json({
			success: true,
			message: 'Here is the Affiliate!',
			data: existingAffiliate,
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Affiliate' });
	}
};

exports.getAffiliates = async (req, res) => {
	const { page } = req.query;
	const affiliatesPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Affiliate.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * affiliatesPerPage)
			.limit(affiliatesPerPage);

		res
			.status(200)
			.json({ success: true, message: 'Affiliates', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Affiliates' });
	}
};

const joiSearchTermScheema = Joi.object({
	term: Joi.string().min(3).required(),
});

exports.searchAffiliate = async (req, res) => {
	const { term } = req.params;
	const { page } = req.query;
	const affiliatesPerPage = 10;

	try {
		const { error, value } = joiSearchTermScheema.validate({
			term,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid search term! ',
				error: error.details,
			});
		}
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Affiliate.find({
			$or: [{ title: { $regex: term, $options: 'i' } }],
		})
			.sort({ createdAt: -1 })
			.skip(pageNum * affiliatesPerPage)
			.limit(affiliatesPerPage);

		res
			.status(200)
			.json({ success: true, message: 'Affiliates', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while searching' });
	}
};

const joiAffiliateScheema = Joi.object({
	title: Joi.string().min(5).required(),
	description: Joi.string().min(10).allow('').optional(),
	affiliateLink: Joi.string().uri().required(),
	thumbnailLink1: Joi.string().uri().required(),
	thumbnailLink2: Joi.string().uri().allow('').optional(),
	thumbnailLink3: Joi.string().uri().allow('').optional(),
});

exports.createAffiliate = async (req, res) => {
	const {
		title,
		description,
		affiliateLink,
		thumbnailLink1,
		thumbnailLink2,
		thumbnailLink3,
	} = req.body;
	try {
		const { error, value } = joiAffiliateScheema.validate({
			title,
			description,
			affiliateLink,
			thumbnailLink1,
			thumbnailLink2,
			thumbnailLink3,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		await Affiliate.create({
			title,
			description,
			affiliateLink,
			thumbnailLink1,
			thumbnailLink2,
			thumbnailLink3,
		});

		res
			.status(201)
			.json({ success: true, message: 'Affiliate created successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while creating the Affiliate' });
	}
};

exports.updateAffiliate = async (req, res) => {
	const { _id } = req.params;
	const {
		title,
		description,
		affiliateLink,
		thumbnailLink1,
		thumbnailLink2,
		thumbnailLink3,
	} = req.body;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Affiliate id not found!' });
		}

		const existingAffiliate = await Affiliate.findOne({ _id });

		if (!existingAffiliate) {
			return res
				.status(400)
				.json({ success: false, message: 'Affiliate is unavailable!' });
		}

		const { error, value } = joiAffiliateScheema.validate({
			title,
			description,
			affiliateLink,
			thumbnailLink1,
			thumbnailLink2,
			thumbnailLink3,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		existingAffiliate.title = title;
		existingAffiliate.description = description;
		existingAffiliate.affiliateLink = affiliateLink;
		existingAffiliate.thumbnailLink1 = thumbnailLink1;
		existingAffiliate.thumbnailLink2 = thumbnailLink2;
		existingAffiliate.thumbnailLink3 = thumbnailLink3;

		await existingAffiliate.save();

		res
			.status(201)
			.json({ success: true, message: 'Affiliate updated successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ message: 'Error while updating the Affiliate' });
	}
};

exports.deleteAffiliate = async (req, res) => {
	const { _id } = req.params;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Affiliate id not found!' });
		}

		const existingAffiliate = await Affiliate.findOne({ _id });

		if (!existingAffiliate) {
			return res
				.status(400)
				.json({ success: false, message: 'Affiliate is already unavailable!' });
		}

		await Affiliate.deleteOne({ _id });

		res
			.status(203)
			.json({ success: true, message: 'Affiliate deleted successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while deleting the Affiliate' });
	}
};
