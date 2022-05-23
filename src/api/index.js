const express = require('express');

const { Router } = express;
const router = new Router();
const users = require('./db/user.js');
const oauth = require('./externalOauth/oauth');

router.use('/user', users);
router.use('/oauth', oauth);
module.exports = router;