const express = require('express');
const { Router } = express;
const router = new Router();
const users = require('./db/user.js');
const oauth = require('./externalApi/oauth.js');
const contact = require('./contact.js');

router.use('/', users);
router.use('/oauth', oauth);
router.use('/contact', contact);

module.exports = router;