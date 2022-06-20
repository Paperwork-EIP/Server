const { Router } = require('express');
const router = new Router();
<<<<<<< HEAD
const facebook = require('./facebook');
const google = require('./google');
=======
const google = require('./facebook');
const discord = require('./google');
>>>>>>> c9fcd16f4aa5189149f83dbb4c6fa4066e6e299f

router.use('/google', google);
router.use('/facebook', facebook);
module.exports = router;