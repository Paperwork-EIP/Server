const express = require('express');
const { Router } = express;
const router = new Router();
const adminProcess = require('./processAdmin');
const adminStep = require('./stepAdmin');
const adminUnderStep = require('./underStepAdmin');

router.use('/process', adminProcess);
router.use('/step', adminStep);
router.use('/underStep', adminUnderStep);

module.exports = router;