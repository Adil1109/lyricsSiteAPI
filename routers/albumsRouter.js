const express = require('express');

const router = express.Router();
const albumsController = require('../controllers/albumsController');

const { identifier } = require('../middlewares/identification');

router.get('/get-albums', albumsController.getAlbums);
router.get('/get-album/:_id', albumsController.getAlbum);
router.get('/search/albums/:term', albumsController.searchAlbum);
router.post('/create-album', identifier, albumsController.createAlbum);
router.patch('/update-album/:_id', identifier, albumsController.updateAlbum);
router.delete('/delete-album/:_id', identifier, albumsController.deleteAlbum);

module.exports = router;
