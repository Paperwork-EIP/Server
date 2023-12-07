const { Router } = require('express');
const router = new Router();
const facebook = require('./facebook');
const google = require('./google');

router.use('/google', google);
router.use('/facebook', facebook);

module.exports = router;