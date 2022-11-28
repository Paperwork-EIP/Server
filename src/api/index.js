const express = require('express');
const { Router } = express;
const router = new Router();
const users = require('./db/user.js');
const oauth = require('./externalApi/oauth');
const middleware = require('../middleware/security')

router.use('/user', users);
router.use('/oauth', oauth);
module.exports = router;