const Song = require('../models/songsModel');
const Joi = require('joi');

exports.getSong = async (req, res) => {
	const { _id } = req.params;
	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Song id not found!' });
		}

		const existingSong = await Song.findOne({ _id });

		if (!existingSong) {
			return res
				.status(400)
				.json({ success: false, message: 'Song is already unavailable!' });
		}

		res.status(200).json({
			success: true,
			message: 'Here is the Song!',
			data: existingSong,
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the Song' });
	}
};

exports.getSongs = async (req, res) => {
	const { page } = req.query;
	const songsPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Song.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * songsPerPage)
			.limit(songsPerPage);

		res.status(200).json({ success: true, message: 'songs', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the songs' });
	}
};

const joiSearchTermScheema = Joi.object({
	term: Joi.string().min(3).required(),
});

exports.searchSong = async (req, res) => {
	const { term } = req.params;
	const { page } = req.query;
	const songsPerPage = 10;

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
		const result = await Song.find({
			$or: [{ title: { $regex: term, $options: 'i' } }],
		})
			.sort({ createdAt: -1 })
			.skip(pageNum * songsPerPage)
			.limit(songsPerPage);

		res.status(200).json({ success: true, message: 'songs', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while searching' });
	}
};

const joiSongScheema = Joi.object({
	title: Joi.string().min(5).required(),
	lyrics: Joi.string().min(10).required(),
	thumbnailLink: Joi.string().uri().allow('').optional(),
	externelLink: Joi.string().uri().allow('').optional(),
});

exports.createSong = async (req, res) => {
	const { title, lyrics, thumbnailLink, externelLink } = req.body;
	try {
		const { error, value } = joiSongScheema.validate({
			title,
			lyrics,
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

		await Song.create({
			title,
			lyrics,
			thumbnailLink,
			externelLink,
		});

		res
			.status(201)
			.json({ success: true, message: 'Song created successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while creating the Song' });
	}
};

exports.updateSong = async (req, res) => {
	const { _id } = req.params;
	const { title, lyrics, thumbnailLink, externelLink } = req.body;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Song id not found!' });
		}

		const existingSong = await Song.findOne({ _id });

		if (!existingSong) {
			return res
				.status(400)
				.json({ success: false, message: 'Song is unavailable!' });
		}

		const { error, value } = joiSongScheema.validate({
			title,
			lyrics,
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

		existingSong.title = title;
		existingSong.lyrics = lyrics;
		existingSong.thumbnailLink = thumbnailLink;

		existingSong.externelLink = externelLink;

		await existingSong.save();

		res
			.status(201)
			.json({ success: true, message: 'Song updated successfully!' });
	} catch (error) {
		return res.status(400).json({ message: 'Error while updating the Song' });
	}
};

exports.deleteSong = async (req, res) => {
	const { _id } = req.params;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Song id not found!' });
		}

		const existingSong = await Song.findOne({ _id });

		if (!existingSong) {
			return res
				.status(400)
				.json({ success: false, message: 'Song is already unavailable!' });
		}

		await Song.deleteOne({ _id });

		res
			.status(203)
			.json({ success: true, message: 'Song deleted successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while deleting the Song' });
	}
};
