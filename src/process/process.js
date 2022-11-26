const { Router } = require('express');
const Process = require('../persistence/process');
const router = new Router();
  
  router.post('/add', async (request, response) => {
    try {
        const { title, description, source, delay } = request.body;
        const res = await Process.create(title, description, source, delay);
        return response.status(200).json({
            message: 'Process created!',
            response: res 
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/delete', async (request, response) => {
    try {
        const { title } = request.body;
        if (!title) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const find = await Process.get(title);
        if(!find) {
          return response.status(404).json({ message: 'Process not found.' });
        } else {
        const res = await Process.delete(title);
        return response.status(200).json({
            message: 'Process delete!',
            response: res 
        });}
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/getAll', async (request, response) => {
    try {
        const res = await Process.getAll();
        return response.status(200).json({
            response: res 
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;