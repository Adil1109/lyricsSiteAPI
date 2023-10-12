const express = require('express');

const router = express.Router();
const songsController = require('../controllers/songsController');

const { identifier } = require('../middlewares/identification');

router.get('/get-songs', songsController.getSongs);
router.get('/get-song/:_id', songsController.getSong);
router.get('/search/songs/:term', songsController.searchSong);
router.post('/create-song', identifier, songsController.createSong);
router.patch('/update-song/:_id', identifier, songsController.updateSong);
router.delete('/delete-song/:_id', identifier, songsController.deleteSong);

module.exports = router;
