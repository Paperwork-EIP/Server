const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const UserProcess = require('../persistence/userProcess');
const router = new Router();
const path = require('path');
const fs = require('fs');

router.post('/create', async (request, response) => {
  try {
    const { title, content, delay } = request.body;
    if (!title || !content) {
      return response.status(400).json({ message: 'Title or content missing' });
    }
    const find = await Process.get(title);
    if (find) {
      return response.status(409).json({ message: 'Process already exists.' });
    }
    const jsonData = JSON.stringify(content, null, 2);
    const filePath = path.join(__dirname, '../data', `${title}.json`);
    const res = await Process.create(title, delay);
    let steps = [];
    for (let i = 0; content[(Object.keys(content)[0])].steps[i]; i++) {
      steps.push(await Step.create(null, res.id, false));
    }
    fs.writeFile(filePath, jsonData, function (err, result) {
      if (err) {
        console.log('error', err);
        return response.status(500).json({ message: 'Error writing file.' });
      }
      return response.status(200).json({
        message: 'Process created!',
        response: res,
        steps: steps
      });
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ message: 'System error.' });
  }
});
router.get('/deleteProcess', async (request, response) => {
  try {
    const { title } = request.query;
    if (!title) {
      return response.status(400).json({ message: 'Missing parameters.' });
    }
    const find = await Process.get(title);
    if (!find) {
      return response.status(404).json({ message: 'Process not found.' });
    } else {
      await Step.deleteAll(find.id);
      await UserProcess.deleteAll(find.id);
      const res = await Process.delete(find.id);
      const filePath = path.join(__dirname, '../data', `${title}.json`);
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
    return response.status(500).json({ message: 'System error.' });
  }
});

router.post('/modifyProcess', async (request, response) => {
  try {
    const { stocked_title, title, description, source, delay, language } = request.body;
    if (!stocked_title || !language) {
      return response.status(400).json({ message: 'Missing parameters.' });
    }
    const find = await Process.get(stocked_title);
    if (!find) {
      return response.status(404).json({ message: 'Process not found.' });
    }
    if (delay) {
      await Process.update(find.id, delay);
    }
    if (title || description || source) {
      await modifyProcessFile(stocked_title, language, title, description, source);
    }
    response.status(200).json({
      message: 'Process modified!',
      process_id: find.id,
      process_title: stocked_title
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'System error.' });
  }
});

async function modifyProcessFile(stocked_title, language, title, description, source) {
  const filePath = path.join(__dirname, '../data', `${stocked_title}.json`);
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const file = JSON.parse(data);
    if (!file) {
      throw new Error('File not found.');
    }
    if (title) {
      file[language].title = title;
    }
    if (description) {
      file[language].description = description;
    }
    if (source) {
      file[language].source = source;
    }
    const jsonData = JSON.stringify(file, null, 2);
    await fs.promises.writeFile(filePath, jsonData);
  } catch (err) {
    throw new Error('Error reading/writing file.');
  }
};

router.get('/getProcess', async (request, response) => {
  try {
    const { stocked_title } = request.query;
    if (!stocked_title) {
      return response.status(400).json({ message: 'Missing parameters.' });
    }
    const find = await Process.get(stocked_title);
    if (!find) {
      return response.status(404).json({ message: 'Process not found.' });
    }
    const filePath = path.join(__dirname, '../data', `${stocked_title}.json`);
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
    return response.status(500).json({ message: 'System error.' });
  }
});
router.get('/getStep', async (request, response) => {
  try {
    const { stocked_title, step_id } = request.query;
    if (!stocked_title || !step_id) {
      return response.status(400).json({ message: 'Missing parameters.' });
    }
    const find = await Process.get(stocked_title);
    if (!find) {
      return response.status(404).json({ message: 'Process not found.' });
    }
    const target = await Step.getById(step_id);
    if (!target) {
      return response.status(404).json({ message: 'Target step not found.' });
    }
    const allSteps = await Step.getByProcess(find.id);
    if (!allSteps) {
      return response.status(404).json({ message: 'Steps not found.' });
    }
    const filePath = path.join(__dirname, '../data', `${stocked_title}.json`);
    let file;
    try {
      file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!file) {
        return response.status(404).json({ message: 'Data not found.' });
      }
    } catch (error) {
      return response.status(404).json({ message: 'Data not found.' });
    }
    let step = [];
    for (i in Object.keys(file)) {
      for (let j in allSteps) {
        if (allSteps[j].id == step_id) {
          let underQuestionsArray = [];
          for (let k in file[Object.keys(file)[i]].steps[j].underQuestions) {
            underQuestionsArray.push({
              id: k,
              title: file[Object.keys(file)[i]].steps[j].underQuestions[k].title,
              type: file[Object.keys(file)[i]].steps[j].underQuestions[k].type,
              description: file[Object.keys(file)[i]].steps[j].underQuestions[k].description,
              source: file[Object.keys(file)[i]].steps[j].underQuestions[k].source,
              question: file[Object.keys(file)[i]].steps[j].underQuestions[k].question
            });
          }
          step.push({
            language: Object.keys(file)[i],
            step_id: allSteps[j].id,
            number: j,
            content: {
              title: file[Object.keys(file)[i]].steps[j].title,
              type: file[Object.keys(file)[i]].steps[j].type,
              description: file[Object.keys(file)[i]].steps[j].description,
              question: file[Object.keys(file)[i]].steps[j].question,
              source: file[Object.keys(file)[i]].steps[j].source,
              delay: file[Object.keys(file)[i]].steps[j].delay,
              underQuestions: underQuestionsArray
            }
          });
        }
      }
    }
    return response.status(200).json({
      message: 'Steps found!',
      stocked_title: stocked_title,
      step: step
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'System error.' });
  }
});

function updateUnderSteps(file, underQuestions, language) {

}

router.post('/updateStep', async (request, response) => {
  try {
    const { stocked_title, step_id, language, delay = 0, title, type, description,
      question, source, is_unique = false, underQuestions = [] } = request.body;
    if (!stocked_title || !step_id || !language) {
      return response.status(400).json({ message: 'Missing parameters.' });
    }
    const find = await Process.get(stocked_title);
    if (!find) {
      return response.status(404).json({ message: 'Process not found.' });
    }
    const target = await Step.getById(step_id);
    if (!target) {
      return response.status(404).json({ message: 'Target step not found.' });
    }
    if (delay) {
      await Step.update(step_id, delay, is_unique);
    }
    const allSteps = await Step.getByProcess(find.id);
    if (!allSteps) {
      return response.status(404).json({ message: 'Steps not found.' });
    }
    const filePath = path.join(__dirname, '../data', `${stocked_title}.json`);
    let file;
    try {
      file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!file) {
        return response.status(404).json({ message: 'Data not found.' });
      }
      let step;
      let j = 0
      for (j in allSteps) {
        if (allSteps[j].id == step_id) {
          for (i in underQuestions) {
            if (underQuestions[i].title) {
              file[language].steps[j].underQuestions[underQuestions[i].id].title = underQuestions[i].title;
            }
            if (underQuestions[i].description) {
              file[language].steps[j].underQuestions[underQuestions[i].id].description = underQuestions[i].description;
            }
            if (underQuestions[i].source) {
              file[language].steps[j].underQuestions[underQuestions[i].id].source = underQuestions[i].source;
            }
            if (underQuestions[i].type) {
              file[language].steps[j].underQuestions[underQuestions[i].id].type = underQuestions[i].type;
            }
            if (underQuestions[i].question) {
              file[language].steps[j].underQuestions[underQuestions[i].id].question = underQuestions[i].auestion;
            }
          }
          if (title) {
            file[language].steps[j].title = title;
          }
          if (type) {
            file[language].steps[j].type = type;
          }
          if (description) {
            file[language].steps[j].description = description;
          }
          if (question) {
            file[language].steps[j].question = question;
          }
          if (source) {
            file[language].steps[j].source = source;
          }
          step = file[language].steps[j];
        }
      }
      const jsonData = JSON.stringify(file, null, 2);
      fs.writeFile(filePath, jsonData, function (err, result) {
        if (err) {
          return response.status(500).json({ message: 'Error writing file.' });
        }
      });
      return response.status(200).json({
        message: 'Step updated!',
        stocked_title: stocked_title,
        step: step
      });
    } catch (error) {
      return response.status(404).json({ message: 'Data not found.' });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'System error.' });
  }
});

module.exports = router;