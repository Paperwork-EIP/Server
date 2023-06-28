const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const router = new Router();
  
  router.get('/get', async (request, response) => {
    try {
        const { title, language } = request.query;
        if (!title || !language) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const process = await Process.get(title);
        if (!process) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        let file;
        try {
            file = require('../data/' + process.title + '.json');
            if (!file) {
                return response.status(404).json({ message: 'Data not found.' });
            }
        } catch (error) {
            return response.status(404).json({ message: 'Data not found.' });
        }
        const data = file[language];
        const steps = await Step.getByProcess(process.id);
        if (!steps || steps.length === 0) {
            return response.status(404).json({ message: 'Steps not found.' });
        }
        let questions = [];
        for (let i in steps) {
            if(!data.steps[i].underQuestions) {
                questions.push(
                {
                    step_id: steps[i].id,
                    question: data.steps[i].question,
                });
            } else {
                let m = [];
                for (let j in data.steps[i].underQuestions) {
                    m.push({
                        step_id: steps[i].id,
                        question: data.steps[i].underQuestions[j].question
                    });
                }
                questions.push(
                {
                    step_id: steps[i].id,
                    question: data.steps[i].question,
                    underQuestions: m
                });
            }
        }
        return response.status(200).json({ title: data.title, questions: questions })
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;