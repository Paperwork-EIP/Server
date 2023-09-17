const express = require('express');
const { Router } = express;
const router = new Router();
const process = require('./process.js');
const step = require('./step.js');
const questions = require('./questions.js');
const userProcess = require('./userProcess.js');
const calendar = require('./calendar.js');
const proseccProposal = require('./processProposal.js');
const admin = require('./admin.js');

router.use('/process', process);
router.use('/step', step);
router.use('/processQuestions', questions);
router.use('/userProcess', userProcess);
router.use('/calendar', calendar);
router.use('/processProposal', proseccProposal);
router.use('/admin', admin);

module.exports = router;