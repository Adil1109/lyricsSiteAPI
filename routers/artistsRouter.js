const express = require('express');

const router = express.Router();
const artistsController = require('../controllers/artistsController');

const { identifier } = require('../middlewares/identification');

router.get('/get-artists', artistsController.getArtists);
router.get('/get-artist/:_id', artistsController.getArtist);
router.get('/search/artists/:term', artistsController.searchArtist);
router.post('/create-artist', identifier, artistsController.createArtist);
router.patch('/update-artist/:_id', identifier, artistsController.updateArtist);
router.delete(
	'/delete-artist/:_id',
	identifier,
	artistsController.deleteArtist
);

module.exports = router;
