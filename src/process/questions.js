const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const router = new Router();
  
  router.post('/get', async (request, response) => {
    try {
        const { title } = request.body;
        const process = await Process.get(title);
        if (!process) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        const steps = await Step.getByProcess(process.id);
        if (!steps) {
            return response.status(404).json({ message: 'Steps not found.' });
        }
        var questions = [];
        for (var i in steps) {
            questions.push(steps[i].question);
        }
        return response.status(200).json({ questions: questions })
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;