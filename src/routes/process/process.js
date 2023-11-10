const { Router } = require('express');
const Process = require('../../persistence/process/process');
const Step = require('../../persistence/process/step');
const UserProcess = require('../../persistence/userProcess/userProcess');
const Tools = require('../../tools');
const router = new Router();
const path = require('path');
const fs = require('fs');

router.post('/add', async (request, response) => {
  try {
      const { title, delay } = request.body;

      if (!title)
        return response.status(400).json({ message: Tools.errorMessages.missingParameters });
      const find = await Process.get(title);
      if (find)
        return response.status(400).json({ message: Tools.errorMessages.processAlreadyExist });
      const res = await Process.create(title, delay);
      return response.status(200).json({
          message: 'Process created!',
          response: res 
      });
  } catch (error) {
      console.error(error);
      return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

router.get('/delete', async (request, response) => {
  try {
      const { title } = request.query;

      if (!title)
          return response.status(400).json({ message: Tools.errorMessages.missingParameters });
      const find = await Process.get(title);
      if(!find)
        return response.status(404).json({ message: Tools.errorMessages.processNotFound });
      else
        await Step.deleteAll(find.id);
        await UserProcess.deleteAll(find.id);
        const res = await Process.delete(find.id);
        return response.status(200).json({
            message: 'Process and steps deleted!',
            response: res
      });
  } catch (error) {
      console.error(error);
      return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

router.get('/getAll', async (request, response) => {
  try {
      const { language } = request.query;

      if (!language)
        return response.status(400).json({ message: Tools.errorMessages.missingParameters });
      const processes = await Process.getAll();
      let res = [];
      for (let i in processes) {
        let file = await Tools.getData(processes[i].title);
        if (!file)
          return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        const data = file[language];
        res.push({
          title: data.title,
          description: data.description,
          source: data.source,
          stocked_title: processes[i].title,
        });
      }
      return response.status(200).json({
          response: res 
      });
  } catch (error) {
    return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

module.exports = router;