const Album = require('../models/albumsModel');
const Joi = require('joi');

exports.getAlbum = async (req, res) => {
	const { _id } = req.params;
	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Album id not found!' });
		}

		const existingAlbum = await Album.findOne({ _id });

		if (!existingAlbum) {
			return res
				.status(400)
				.json({ success: false, message: 'Album is already unavailable!' });
		}

		res.status(200).json({
			success: true,
			message: 'Here is the Album!',
			data: existingAlbum,
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Album' });
	}
};

exports.getAlbums = async (req, res) => {
	const { page } = req.query;
	const albumsPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Album.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * albumsPerPage)
			.limit(albumsPerPage);

		res.status(200).json({ success: true, message: 'Albums', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Albums' });
	}
};

const joiSearchTermScheema = Joi.object({
	term: Joi.string().min(3).required(),
});

exports.searchAlbum = async (req, res) => {
	const { term } = req.params;
	const { page } = req.query;
	const albumsPerPage = 10;

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
		const result = await Album.find({
			$or: [{ name: { $regex: term, $options: 'i' } }],
		})
			.sort({ createdAt: -1 })
			.skip(pageNum * albumsPerPage)
			.limit(albumsPerPage);

		res.status(200).json({ success: true, message: 'Albums', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while searching' });
	}
};

const joiAlbumScheema = Joi.object({
	name: Joi.string().min(5).required(),
	description: Joi.string().min(10).required(),
	thumbnailLink: Joi.string().uri().allow('').optional(),
	externelLink: Joi.string().uri().allow('').optional(),
});

exports.createAlbum = async (req, res) => {
	const { name, description, thumbnailLink, externelLink } = req.body;
	try {
		const { error, value } = joiAlbumScheema.validate({
			name,
			description,
			thumbnailLink,
			externelLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		await Album.create({
			name,
			description,
			thumbnailLink,
			externelLink,
		});

		res
			.status(201)
			.json({ success: true, message: 'Album created successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while creating the Album' });
	}
};

exports.updateAlbum = async (req, res) => {
	const { _id } = req.params;
	const { name, description, thumbnailLink, externelLink } = req.body;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Album id not found!' });
		}

		const existingAlbum = await Album.findOne({ _id });

		if (!existingAlbum) {
			return res
				.status(400)
				.json({ success: false, message: 'Album is unavailable!' });
		}

		const { error, value } = joiAlbumScheema.validate({
			name,
			description,
			thumbnailLink,

			externelLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		existingAlbum.name = name;
		existingAlbum.description = description;
		existingAlbum.thumbnailLink = thumbnailLink;

		existingAlbum.externelLink = externelLink;

		await existingAlbum.save();

		res
			.status(201)
			.json({ success: true, message: 'Album updated successfully!' });
	} catch (error) {
		return res.status(400).json({ message: 'Error while updating the Album' });
	}
};

exports.deleteAlbum = async (req, res) => {
	const { _id } = req.params;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Album id not found!' });
		}

		const existingAlbum = await Album.findOne({ _id });

		if (!existingAlbum) {
			return res
				.status(400)
				.json({ success: false, message: 'Album is already unavailable!' });
		}

		await Album.deleteOne({ _id });

		res
			.status(203)
			.json({ success: true, message: 'Album deleted successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while deleting the Album' });
	}
};
