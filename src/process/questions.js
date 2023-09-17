const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const router = new Router();

const getData = async (title) => {
    try {
      return require(`../data/${title}.json`);
    } catch (error) {
      return null;
    }
  };
  
  const mapQuestions = (steps, data, language) => {
    return steps.map((step, i) => {
      const stepData = {
        step_id: step.id,
        question: data[language].steps[i].question,
      };
      if (data[language].steps[i].underQuestions && data[language].steps[i].underQuestions.length > 0) {
        stepData.underQuestions = data[language].steps[i].underQuestions.map((underQuestion) => ({
          step_id: step.id,
          question: underQuestion.question,
        }));
      }
      return stepData;
    });
  };
  
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
      const data = await getData(title);
      if (!data) {
        return response.status(404).json({ message: 'Data not found.' });
      }
      const steps = await Step.getByProcess(process.id);
      if (!steps || steps.length === 0) {
        return response.status(404).json({ message: 'Steps not found.' });
      }
      const questions = mapQuestions(steps, data, language);
      return response.status(200).json({ title: data.title, questions });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });
  

module.exports = router;