const { Router } = require('express');
const router = new Router();
const google = require('./externalApi/facebook');
const discord = require('./externalApi/google');

router.use('/google', google);
router.use('/facebook', facebook);
module.exports = router;