const express = require('express');

const router = express.Router();
const affiliatesController = require('../controllers/affiliatesController');

const { identifier } = require('../middlewares/identification');

router.get('/get-affiliates', affiliatesController.getAffiliates);
router.get('/get-affiliate/:_id', affiliatesController.getAffiliate);
router.get('/search/affiliates/:term', affiliatesController.searchAffiliate);
router.post(
	'/create-affiliate',
	identifier,
	affiliatesController.createAffiliate
);
router.patch(
	'/update-affiliate/:_id',
	identifier,
	affiliatesController.updateAffiliate
);
router.delete(
	'/delete-affiliate/:_id',
	identifier,
	affiliatesController.deleteAffiliate
);

module.exports = router;
