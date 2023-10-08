const express = require('express');
const { Router } = express;
const router = new Router();
const process = require('./process/process.js');
const step = require('./process/step.js');
const questions = require('./process/questions.js');
const userProcess = require('./userProcess/userProcess.js');
const calendar = require('./userProcess/calendar.js');
const proseccProposal = require('./process/processProposal.js');
const admin = require('./admin/admin.js');

router.use('/process', process);
router.use('/step', step);
router.use('/processQuestions', questions);
router.use('/userProcess', userProcess);
router.use('/calendar', calendar);
router.use('/processProposal', proseccProposal);
router.use('/admin', admin);

module.exports = router;