const { Router } = require('express');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const router = new Router();
  
router.post('/add', async (request, response) => {
    try {
        const { title, type, description, question, source, expire_date, is_unique, delay, process_title } = request.body;
        const { id } = await Process.get(process_title);
        if (!id) {
            return response.status(500).json({ message: 'Process not found' });
        }
        const res = await Step.create(title, type, description, question, source, expire_date, is_unique, delay, id);
        return response.status(200).json({
            message: 'Step created!',
            response: res 
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;