const express = require('express');
const { Router } = express;
const router = new Router();
const process = require('./process.js');
const step = require('./step.js');
const questions = require('./questions.js');

router.use('/process', process);
router.use('/step', step);
router.use('/processQuestions', questions);

module.exports = router;