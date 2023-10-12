const Artist = require('../models/artistsModel');
const Joi = require('joi');

exports.getArtist = async (req, res) => {
	const { _id } = req.params;
	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Artist id not found!' });
		}

		const existingArtist = await Artist.findOne({ _id });

		if (!existingArtist) {
			return res
				.status(400)
				.json({ success: false, message: 'Artist is already unavailable!' });
		}

		res.status(200).json({
			success: true,
			message: 'Here is the Artist!',
			data: existingArtist,
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Artist' });
	}
};

exports.getArtists = async (req, res) => {
	const { page } = req.query;
	const artistsPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Artist.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * artistsPerPage)
			.limit(artistsPerPage);

		res.status(200).json({ success: true, message: 'Artists', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the artists' });
	}
};

const joiSearchTermScheema = Joi.object({
	term: Joi.string().min(2).required(),
});

exports.searchArtist = async (req, res) => {
	const { term } = req.params;
	const { page } = req.query;
	const artistsPerPage = 10;

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
		const result = await Artist.find({
			$or: [{ name: { $regex: term, $options: 'i' } }],
		})
			.sort({ createdAt: -1 })
			.skip(pageNum * artistsPerPage)
			.limit(artistsPerPage);

		res.status(200).json({ success: true, message: 'Artists', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while searching' });
	}
};

const joiArtistScheema = Joi.object({
	name: Joi.string().min(5).required(),
	about: Joi.string().min(10).required(),
	imageLink: Joi.string().uri().required().allow('').optional(),
	externelLink: Joi.string().uri().allow('').optional(),
});

exports.createArtist = async (req, res) => {
	const { name, about, imageLink, externelLink } = req.body;
	try {
		const { error, value } = joiArtistScheema.validate({
			name,
			about,
			imageLink,
			externelLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		await Artist.create({
			name,
			about,
			imageLink,
			externelLink,
		});

		res
			.status(201)
			.json({ success: true, message: 'Artist created successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while creating the Artist' });
	}
};

exports.updateArtist = async (req, res) => {
	const { _id } = req.params;
	const { name, about, imageLink, externelLink } = req.body;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Artist id not found!' });
		}

		const existingArtist = await Artist.findOne({ _id });

		if (!existingArtist) {
			return res
				.status(400)
				.json({ success: false, message: 'Artist is unavailable!' });
		}

		const { error, value } = joiArtistScheema.validate({
			name,
			about,
			imageLink,

			externelLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		existingArtist.name = name;
		existingArtist.about = about;
		existingArtist.imageLink = imageLink;
		existingArtist.externelLink = externelLink;

		await existingArtist.save();

		res
			.status(201)
			.json({ success: true, message: 'Artist updated successfully!' });
	} catch (error) {
		return res.status(400).json({ message: 'Error while updating the Artist' });
	}
};

exports.deleteArtist = async (req, res) => {
	const { _id } = req.params;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Artist id not found!' });
		}

		const existingArtist = await Artist.findOne({ _id });

		if (!existingArtist) {
			return res
				.status(400)
				.json({ success: false, message: 'Artist is already unavailable!' });
		}

		await Artist.deleteOne({ _id });

		res
			.status(203)
			.json({ success: true, message: 'Artist deleted successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while deleting the Artist' });
	}
};
