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
        content: jsonData,
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
  //old commands
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