const { Router } = require('express');
const UserProcess = require('../persistence/userProcess');
const User = require('../persistence/users');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const UserStep = require('../persistence/userStep');
const router = new Router();

router.post('/add', async (request, response) => {
    try {
        const { user_email, process_title, questions } = request.body;
        if (!user_email || !process_title || !questions) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = await User.find(user_email);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const process = await Process.get(process_title);
        if (!process) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        user_process = await UserProcess.get(user.id, process.id);
        if (!user_process) {
            user_process = await UserProcess.create(user.id, process.id);
        } else {
            await UserStep.deleteAll(user_process.id);
        }
        for (var i in questions) {
            step_id = questions[i][0];
            answer = questions[i][1];
            if (!await Step.getById(step_id)) {
                return response.status(404).json({ message: 'Step not found.' });
            }
            await UserStep.create(user_process.id, step_id, answer);
        }
        return response.status(200).json({
            message: 'User process',
            response: user_process.id
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
});

router.get('/delete', async (request, response) => {
    try {
        const { user_email, process_title } = request.body;
        if (!user_email || !process_title) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = await User.find(user_email);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const process = await Process.get(process_title);
        if (!process) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        user_process = await UserProcess.get(user.id, process.id);
        await UserStep.deleteAll(user_process.id);
        const res = await UserProcess.delete(user.id, process.id);
        return response.status(200).json({
            message: 'User process deleted!',
            response: res
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
});
router.get('/getUserSteps', async (request, response) => {
    try {
        const { user_email, process_title } = request.body;
        if (!user_email || !process_title) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = await User.find(user_email);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const process = await Process.get(process_title);
        if (!process) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        const user_process = await UserProcess.get(user.id, process.id);
        const res = await UserStep.getAll(user_process.id);
        const notDone = await UserStep.getNotDone(user_process.id);
        const pourcentage = (res.length - notDone.length) / res.length * 100;
        return response.status(200).json({
            message: 'User process steps',
            pourcentage: pourcentage,
            response: res
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
});
router.get('/getUserProcesses', async (request, response) => {
    try {
        const { user_email } = request.body;
        if (!user_email) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = await User.find(user_email);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const res = await UserProcess.getAll(user.id);
        return response.status(200).json({
            message: 'User processes',
            response: res
        });
    } catch (error) {
        return response.status(500).json({ message: 'System error.' });
    }
});

module.exports = router;