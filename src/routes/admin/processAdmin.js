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
    const { title, content, delay } = request.body;

    if (!title || !content)
      return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const find = await Process.get(title);
    if (find)
      return response.status(409).json({ message: Tools.errorMessages.processAlreadyExists });
    const jsonData = JSON.stringify(content, null, 2);
    const filePath = path.join(__dirname, '../../data', `${title}.json`);
    const res = await Process.create(title, delay);
    let steps = [];
    for (let i = 0; content[(Object.keys(content)[0])].steps[i]; i++)
      steps.push(await Step.create(null, res.id, false));
    fs.writeFile(filePath, jsonData, function (err, result) {
      if (err) {
        console.log('error', err);
        return response.status(500).json({ message: Tools.errorMessages.errWritingFile });
      }
      return response.status(200).json({
        message: 'Process created!',
        response: res,
        steps: steps
      });
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

router.get('/delete', async (request, response) => {
  try {
    const { title } = request.query;

    if (!title)
      return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const find = await Process.get(title);
    if (!find)
      return response.status(404).json({ message: Tools.errorMessages.processNotFound });
    else {
      await Step.deleteAll(find.id);
      await UserProcess.deleteAll(find.id);
      const res = await Process.delete(find.id);
      const filePath = path.join(__dirname, '../../data', `${title}.json`);
      fs.unlink(filePath, function (err, result) {
        if (err) {
          console.log('error', err);
          return response.status(500).json({ message: 'Error deleting file.' });
        }
        return response.status(200).json({
          message: 'Process and steps deleted!',
          response: res
        });
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

router.post('/modify', async (request, response) => {
  try {
    const { stocked_title, title, description, source, delay, language } = request.body;

    if (!stocked_title || !language)
      return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const find = await Process.get(stocked_title);
    if (!find)
      return response.status(404).json({ message: Tools.errorMessages.processNotFound });
    if (delay)
      await Process.update(find.id, delay);
    if (title || description || source)
      await modifyProcessFile(stocked_title, language, title, description, source);
    response.status(200).json({
      message: 'Process modified!',
      process_id: find.id,
      process_title: stocked_title
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

async function modifyProcessFile(stocked_title, language, title, description, source) {
  const filePath = path.join(__dirname, '../../data', `${stocked_title}.json`);

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const file = JSON.parse(data);

    if (!file)
      throw new Error('File not found.');
    if (title)
      file[language].title = title;
    if (description)
      file[language].description = description;
    if (source)
      file[language].source = source;
    const jsonData = JSON.stringify(file, null, 2);
    await fs.promises.writeFile(filePath, jsonData);
  } catch (err) {
    throw new Error('Error reading/writing file.');
  }
};

router.get('/get', async (request, response) => {
  try {
    const { stocked_title } = request.query;

    if (!stocked_title)
      return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const find = await Process.get(stocked_title);
    if (!find)
      return response.status(404).json({ message: Tools.errorMessages.processNotFound });
    const filePath = path.join(__dirname, '../../data', `${stocked_title}.json`);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log('error', err);
        return response.status(500).json({ message: 'Error reading file.' });
      }
      const file = JSON.parse(data);
      let process = [];
      for (let i in Object.keys(file)) {
        process.push({
          language: Object.keys(file)[i],
          content: {
            title: file[Object.keys(file)[i]].title,
            description: file[Object.keys(file)[i]].description,
            source: file[Object.keys(file)[i]].source
          }
        });
      }
      return response.status(200).json({
        message: 'Process found!',
        stocked_title: stocked_title,
        process: process
      });
    })
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

router.get('/getlanguage', async (request, response) => {
  try {
    const { stocked_title } = request.query;

    if (!stocked_title)
      return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const find = await Process.get(stocked_title);
    if (!find)
      return response.status(404).json({ message: Tools.errorMessages.processNotFound });
    const data = await Tools.getData(stocked_title);
    if (!data)
      return response.status(404).json({ message: Tools.errorMessages.languageNotFound });
    if (Object.keys(data).length === 0)
      return response.status(404).json({ message: Tools.errorMessages.languageNotFound });
    console.log(Object.keys(data));
    return response.status(200).json({
      message: 'Languages found!',
      languages: Object.keys(data)
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: Tools.errorMessages.systemError });
  }
});

module.exports = router;