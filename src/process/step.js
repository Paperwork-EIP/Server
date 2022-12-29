const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const router = new Router();
  
router.post('/add', async (request, response) => {
    try {
        const { title, type, description, question, source, is_unique, delay, process_title } = request.body;
        if (!title || !type || !description || !question || !process_title) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const process = await Process.get(process_title);
        if (!process) {
            return response.status(404).json({ message: 'Process not found' });
        }
        const res = await Step.create(title, type, description, question, source, delay, process.id, is_unique);
        return response.status(200).json({
            message: 'Step created!',
            response: res 
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
  });
  router.get('/deleteall', async (request, response) => {
    try {
        const { process_title } = request.query;
        if (!process_title) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const { id } = await Process.get(process_title);
        if (!id) {
            return response.status(404).json({ message: 'Steps not found' });
        }
        const res = await Step.deleteAll(id);
        return response.status(200).json({
            message: 'Steps delete!',
            response: res 
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;