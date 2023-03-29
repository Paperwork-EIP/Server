const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const router = new Router();
  
  router.get('/get', async (request, response) => {
    try {
        const { title } = request.query;
        if (!title) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const process = await Process.get(title);
        if (!process) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        const steps = await Step.getByProcess(process.id);
        if (!steps || steps.length === 0) {
            return response.status(404).json({ message: 'Steps not found.' });
        }
        let questions = [];
        for (let i in steps) {
            questions.push(
                {
                    step_id: steps[i].id,
                    question: steps[i].question
                });
        }
        return response.status(200).json({ questions: questions })
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;