const { Router } = require('express');
const Process = require('../persistence/process');
const router = new Router();
  
  router.post('/add', async (request, response) => {
    try {
        const { title, description, source } = request.body;
        const res = await Process.create(title, description, source);
        return response.status(200).json({
            message: 'Process created!',
            response: res 
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
  });

module.exports = router;