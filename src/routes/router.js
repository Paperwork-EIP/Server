const express = require('express');
const { Router } = express;
const router = new Router();
const users = require('./users/userRouter.js');
const process = require('./process/process.js');
const step = require('./process/step.js');
const questions = require('./process/questions.js');
const userProcess = require('./userProcess/userProcess.js');
const calendar = require('./calendar/calendar.js');
const proseccProposal = require('./processProposal/processProposal.js');
const admin = require('./admin/adminRouter');

router.use('/user', users);
router.use('/process', process);
router.use('/step', step);
router.use('/processquestions', questions);
router.use('/userprocess', userProcess);
router.use('/calendar', calendar);
router.use('/processproposal', proseccProposal);
router.use('/admin', admin);

module.exports = router;