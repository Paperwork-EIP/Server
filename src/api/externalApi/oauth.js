const { Router } = require('express');
const router = new Router();
const google = require('./facebook');
const discord = require('./google');

router.use('/google', google);
router.use('/facebook', facebook);
module.exports = router;