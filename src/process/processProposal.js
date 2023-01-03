const { Router } = require('express');
const User = require('../persistence/users');
const ProcessProposal = require('../persistence/processProposal');
const router = new Router();

router.post('/add', async (request, response) => {
    try {
        const { title, description, content, user_email } = request.body;
        if (!title || !description || !content || !user_email) {
            return response.status(400).json({ message: 'Missing fields.' });
        }
        const user = await User.find(user_email);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const result = await ProcessProposal.create(title, description, content, user.id);
        if (result) {
            return response.status(200).json({ message: 'Proposal added.', responde: result });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});
router.get('/getAll', async (request, response) => {
    try {
        const result = await ProcessProposal.getAll();
        return response.status(200).json({ message: 'Proposals found.', responde: result });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});
router.get('/delete', async (request, response) => {
    try {
        const { id } = request.query;
        if (!id) {
            return response.status(400).json({ message: 'Missing fields.' });
        }
        const processProposal = await ProcessProposal.get(id);
        if (!processProposal) {
            return response.status(400).json({ message: 'Proposal not found.' });
        }
        const result = await ProcessProposal.delete(processProposal.id);
        return response.status(200).json({ message: 'Proposal deleted.', responde: result });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});

module.exports = router;