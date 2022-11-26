const { Router } = require('express');
const Step = require('../persistence/step');
const UserProcess = require('../persistence/userProcess');
const UserStep = require('../persistence/userSteps');
const router = new Router();
  
  router.post('/add', async (request, response) => {
    try {
        const { process_title, user_email, questions } = request.body;
        if (!process_title || !user_email || !questions) {
          return response.status(400).json({ message: 'Missing parameters' });
        }
        const res = await UserProcess.create(process_title, user_email);
        if (!res) {
          return response.status(404).json({ message: 'Process or user not found' });
        }
        for (var i in questions) {
          console.log("test");
          await UserStep.create(questions[i][0], questions[i][1], res.id);
        }
        return response.status(200).json({
            message: 'User process and user steps created!',
            response: res
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/delete', async (request, response) => {
    try {
        const { title } = request.body;
        const res = await UserProcess.delete(title);
        return response.status(200).json({
            message: 'UserProcess delete!',
            response: res 
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/getUserSteps', async (request, response) => {
    try {
      const { process_title, user_email } = request.body;
      const userStep = await UserProcess.getUserSteps(process_title, user_email);
      var task = [];
      var step = null;
      for (var i in userStep) {
        if (userStep[i].is_done == false) {
          step = await Step.getById(userStep[i].step_id);
          task.push([step.title, step.type, step.description, step.source]);
        }
      }
      return response.status(200).json({task});
    } catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/getUserProcess', async (request, response) => {
    try {
      const { process_title, user_email } = request.body;
      if (!process_title || !user_email) {
        return response.status(400).json({ message: 'Missing parameters.' });
      }
      const userProcess = await UserProcess.getUserProcess(process_title, user_email);
      if (!userProcess) {
        return response.status(404).json({ message: 'Cannot find user process.' });
      } else {
      return response.status(200).json({userProcess});
      }
    } catch (error) {
      return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;