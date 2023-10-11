const express = require('express');
const { Router } = express;
const router = new Router();
const users = require('./db/user.js');
const oauth = require('./externalApi/oauth');
const contact = require('./contact.js');

router.use('/user', users);
router.use('/oauth', oauth);
router.use('/contact', contact);

module.exports = router;