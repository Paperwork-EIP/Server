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
        let user_process = await UserProcess.get(user.id, process.id);
        if (!user_process) {
            user_process = await UserProcess.create(user.id, process.id, process.title);
        } else {
            await UserStep.deleteAll(user_process.id);
        }
        for (let i in questions) {
            let step_id = questions[i].step_id;
            let answer = questions[i].response;
            if (!await Step.getById(step_id)) {
                return response.status(404).json({ message: 'Step not found.' });
            }
            await UserStep.create(user_process.id, step_id, answer);
        }
        const notDone = await UserStep.getNotDone(user_process.id);
        if (notDone.length === 0) {
            await UserProcess.update(user_process.id, process.id, true);
        } else {
            await UserProcess.update(user_process.id, process.id, false);
        }
        return response.status(200).json({
            message: 'User process created!',
            response: user_process.id
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});

router.post('/update', async (request, response) => {
    try {
        const { user_email, process_title, step } = request.body;
        if (!user_email || !process_title || !step) {
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
        if (!user_process) {
            return response.status(404).json({ message: 'User process not found.' });
        }
        let res = [];
        for (i in step) {
            if (!await Step.getById(step[i].step_id)) {
                return response.status(404).json({ message: 'Step not found.' });
            }
            res.push(await UserStep.update(user_process.id, step[i].step_id, step[i].is_done));
        }
        const notDone = await UserStep.getNotDone(user_process.id);
        let done = false;
        if (notDone.length === 0) {
            done = true;
        }
        await UserProcess.update(user_process.id, process.id, done);
        return response.status(200).json({
            message: 'User process updated!',
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});

router.get('/delete', async (request, response) => {
    try {
        const { user_email, process_title } = request.query;
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
        await UserStep.deleteAll(user_process.id);
        const res = await UserProcess.delete(user.id, process.id);
        return response.status(200).json({
            message: 'User process deleted!',
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});

async function getPercentage(user_process_id) {
    const res = await UserStep.getAll(user_process_id);
    const notDone = await UserStep.getNotDone(user_process_id);
    const x = (res.length - notDone.length) / res.length * 100;
    const pourcentage = Math.round(x);
    return pourcentage;
}

router.get('/getUserSteps', async (request, response) => {
    try {
        const { user_email, process_title } = request.query;
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
        if (!user_process) {
            return response.status(404).json({ message: 'User process not found.' });
        }
        const res = await UserStep.getAll(user_process.id);
        const pourcentage = await getPercentage(user_process.id);
        return response.status(200).json({
            message: 'User process steps',
            pourcentage: pourcentage,
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});
router.get('/getUserStepsById', async (request, response) => {
    try {
        const { user_process_id } = request.query;
        if (!user_process_id) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user_process = await UserProcess.getById(user_process_id);
        if (!user_process) {
            return response.status(404).json({ message: 'User process not found.' });
        }
        const res = await UserStep.getAll(user_process.id);
        const pourcentage = await getPercentage(user_process.id);
        return response.status(200).json({
            message: 'User process steps',
            pourcentage: pourcentage,
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});
router.get('/getUserProcesses', async (request, response) => {
    try {
        const { user_email } = request.query;
        if (!user_email) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = await User.find(user_email);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const userProcesses = await UserProcess.getAll(user.id);
        let res = [];
        for (let i in userProcesses) {
            const percentage = await getPercentage(userProcesses[i].id);
            res.push({
                pourcentage: percentage,
                userProcess: userProcesses[i]
            });  
        }
        return response.status(200).json({
            message: 'User processes',
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'System error.' });
    }
});

module.exports = router;