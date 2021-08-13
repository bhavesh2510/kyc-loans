const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation-middleware');

var kycController = require('../controllers/kyc-controller');

router.post('/kyc/add', kycController.add);
router.post('/kyc/update',validation.update, kycController.update);
router.get('/kyc/test', kycController.test);
module.exports = router;
