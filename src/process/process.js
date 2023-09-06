const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const UserProcess = require('../persistence/userProcess');
const router = new Router();
const path = require('path');
const fs = require('fs');

// admin interface commands
  router.post('/create', async (request, response) => {
    try {
      const { title, content, delay } = request.body;
      if (!title || !content) {
        return response.status(400).json({ message: 'Title or content missing' });
      }
      const find = await Process.get(title);
      if (find) {
        return response.status(400).json({ message: 'Process already exists.' });
      }
      const jsonData = JSON.stringify(content, null, 2);
      const filePath = path.join(__dirname, '../data', `${title}.json`);
      const res = await Process.create(title, delay);
      let steps = [];
      for (let i in content.english.steps)
        steps.push(await Step.create(null, res.id, false));
      fs.writeFile(filePath, jsonData, function (err, result) {
        if (err) {
          console.log('error', err);
          return response.status(500).json({ message: 'Error writing file.' });
        }
      });
      return response.status(200).json({
        message: 'Process created!',
        response: res,
        steps: steps
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
  // //get process
  // router.get('/getProcess', async (request, response) => {
  //   try {
  //     const { title } = request.query;
  //     if (!title) {
  //       return response.status(400).json({ message: 'Missing parameters.' });
  //     }
  //     const find = await Process.get(title);
  //     if (!find) {
  //       return response.status(404).json({ message: 'Process not found.' });
  //     }
  //     const filePath = path.join(__dirname, '../data', `${title}.json`);
  //     let file;
  //     try {
  //     } catch (error) {
  //       console.error(error);
  //       return response.status(500).json({ message: 'System error.' });
  //     }
  //     return response.status(200).json({
  //       message: 'Process found!',
  //       process: find,
  //       data: file
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return response.status(500).json({ message: 'System error.' });
  //   }
  // });
  //modify process
  router.post('/modifyProcess', async (request, response) => {
    try {
      const { stocked_title, title, description, source, delay, language } = request.body;
      if (!stocked_title) {
        return response.status(400).json({ message: 'Missing parameters.' });
      }
      const find = await Process.get(stocked_title);
      if (!find) {
        return response.status(404).json({ message: 'Process not found.' });
      }
      if (delay) {
        await Process.update(find.id, delay);
      }
      if (language != '' && title || description || source) {
        const filePath = path.join(__dirname, '../data', `${stocked_title}.json`);
        let file;
        try {
          file = require('../data/' + stocked_title + '.json');
          if (!file) {
            return response.status(404).json({ message: 'Data not found.' });
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
          fs.writeFile(filePath, jsonData, function (err, result) {
            if (err) {
              return response.status(500).json({ message: 'Error writing file.' });
            }
          });
        } catch (error) {
          return response.status(404).json({ message: 'Data not found.' });
        }
      }
      return response.status(200).json({
        message: 'Process modified!',
        process_id: find.id,
        process_title: stocked_title
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });
  //get process
  router.get('/getProcess', async (request, response) => {
    try {
      const { stocked_title } = request.query;
      console.log(stocked_title);
      if (!stocked_title) {
        return response.status(400).json({ message: 'Missing parameters.' });
      }
      const find = await Process.get(stocked_title);
      if (!find) {
        return response.status(404).json({ message: 'Process not found.' });
      }
      const filePath = path.join(__dirname, '../data', `${stocked_title}.json`);
      let file;
      try {
        file = require('../data/' + stocked_title + '.json');
        if (!file) {
          return response.status(404).json({ message: 'Data not found.' });
        }
      }
      catch (error) {
        return response.status(404).json({ message: 'Data not found.' });
      }
      console.log(Object.keys(file));
      let process = [];
      for (i in Object.keys(file)) {
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
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });
  //get steps
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
      const target = Step.getById(step_id);
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
        file = require('../data/' + stocked_title + '.json');
        if (!file) {
          return response.status(404).json({ message: 'Data not found.' });
        }
      } catch (error) {
        return response.status(404).json({ message: 'Data not found.' });
      }
      let step = [];
      for (i in Object.keys(file)) {
        for (j in allSteps) {
          if (allSteps[j].id == step_id) {
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
                delay: file[Object.keys(file)[i]].steps[j].delay
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
  router.post('/updateStep', async (request, response) => {
    try {
      const { stocked_title, step_id, delay = 0, title, type, description, question, source, is_unique = false } = request.body;
      if (!stocked_title || !step_id) {
        return response.status(400).json({ message: 'Missing parameters.' });
      }
      const find = await Process.get(stocked_title);
      if (!find) {
        return response.status(404).json({ message: 'Process not found.' });
      }
      const target = Step.getById(step_id);
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
        file = require('../data/' + stocked_title + '.json');
        if (!file) {
          return response.status(404).json({ message: 'Data not found.' });
        }
        for (i in Object.keys(file)) {
          for (j in allSteps) {
            if (allSteps[j].id == step_id) {
              if (title) {
                file[Object.keys(file)[i]].steps[j].title = title;
              }
              if (type) {
                file[Object.keys(file)[i]].steps[j].type = type;
              }
              if (description) {
                file[Object.keys(file)[i]].steps[j].description = description;
              }
              if (question) {
                file[Object.keys(file)[i]].steps[j].question = question;
              }
              if (source) {
                file[Object.keys(file)[i]].steps[j].source = source;
              }
            }
          }
        }
        const jsonData = JSON.stringify(file, null, 2);
        fs.writeFile(filePath, jsonData, function (err, result) {
          if (err) {
            return response.status(500).json({ message: 'Error writing file.' });
          }
        });
      } catch (error) {
        return response.status(404).json({ message: 'Data not found.' });
      }
      return response.status(200).json({
        message: 'Steps found!',
        stocked_title: stocked_title,
        steps: steps
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'System error.' });
    }
  });
  router.post('/add', async (request, response) => {
    try {
        const { title, delay } = request.body;
        if (!title) {
          return response.status(400).json({ message: 'Title or description missing' });
        }
        const find = await Process.get(title);
        if (find) {
          return response.status(400).json({ message: 'Process already exists.' });
        }
        const res = await Process.create(title, delay);
        return response.status(200).json({
            message: 'Process created!',
            response: res 
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/delete', async (request, response) => {
    try {
        const { title } = request.query;
        if (!title) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const find = await Process.get(title);
        if(!find) {
          return response.status(404).json({ message: 'Process not found.' });
        } else {
          await Step.deleteAll(find.id);
          await UserProcess.deleteAll(find.id);
          const res = await Process.delete(find.id);
          return response.status(200).json({
              message: 'Process and steps deleted!',
              response: res
        });}
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/getAll', async (request, response) => {
    try {
        const { language } = request.query;
        if (!language) {
          return response.status(400).json({ message: 'Missing parameters.' });
        }
        const processes = await Process.getAll();
        let res = [];
        for (let i in processes) {
          let file;
          try {
            file = require('../data/' + processes[i].title + '.json');
            if (!file) {
              return response.status(404).json({ message: 'Data not found.' });
            }
          } catch (error) {
            return response.status(404).json({ message: 'Data not found.' });
          }
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
      return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;