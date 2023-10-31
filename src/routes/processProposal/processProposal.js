const { Router } = require('express');
const User = require('../../persistence/users/users');
const ProcessProposal = require('../../persistence/processProposal/processProposal');
const Tools = require('../../tools');
const router = new Router();

router.post('/add', async (request, response) => {
    try {
        const { title, description, content, user_token } = request.body;

        if (!title || !description || !content || !user_token)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user = await User.findToken(user_token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const result = await ProcessProposal.create(title, description, content, user.id);
        if (result)
            return response.status(200).json({ message: 'Proposal added.', response: result });
        else
            return response.status(409).json({ message: 'Could not create a process.'});
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});
router.get('/getall', async (request, response) => {
    try {
        const result = await ProcessProposal.getAll();

        return response.status(200).json({ message: 'Proposals found.', response: result });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});
router.get('/delete', async (request, response) => {
    try {
        const { id } = request.query;

        if (!id)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const processProposal = await ProcessProposal.get(id);
        if (!processProposal)
            return response.status(400).json({ message: Tools.errorMessages.processProposalNotFound });
        const result = await ProcessProposal.delete(processProposal.id);
        return response.status(200).json({ message: 'Proposal deleted.', response: result });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

module.exports = router;