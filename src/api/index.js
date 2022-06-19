const express = require('express');
const { Router } = express;
const router = new Router();
const users = require('./db/user.js');
const tokens = require('./db/token.js');
const oauth = require('./externalOauth/oauth');

router.use('/user', users);
router.use('/oauth', oauth);
router.use('/token', middleware.checkJWT, tokens);
module.exports = router;