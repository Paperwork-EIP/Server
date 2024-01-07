const { Router } = require('express');
const Process = require('../../persistence/process/process');
const Step = require('../../persistence/process/step');
const Tools = require('../../tools');
const router = new Router();
  
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

    if (!title || !language)
      return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const process = await Process.get(title);
    if (!process)
      return response.status(404).json({ message: Tools.errorMessages.processNotFound });
    const data = await Tools.getData(title);
    if (!data)
      return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
    const steps = await Step.getByProcess(process.id);
    if (!steps || steps.length === 0)
      return response.status(404).json({ message: Tools.errorMessages.stepsNotFound });
    const questions = mapQuestions(steps, data, language);
    return response.status(200).json({ title: data.title, questions });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

module.exports = router;
module.exports.mapQuestions = mapQuestions;