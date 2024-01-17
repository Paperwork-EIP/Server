const { Router } = require('express');
const UserProcess = require('../../persistence/userProcess/userProcess');
const User = require('../../persistence/users/users');
const Process = require('../../persistence/process/process');
const Step = require('../../persistence/process/step');
const UserStep = require('../../persistence/userProcess/userStep');
const UserUnderStep = require('../../persistence/userProcess/userUnderStep');
const Tools = require('../../tools');
const router = new Router();

router.post('/add', async (request, response) => {
    try {
        const { user_token, process_title, questions } = request.body;

        if (!user_token || !process_title || !questions)
            return response.status(400).json({ message: Tools.errorMessages });
        const user = await User.findToken(user_token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        if (await UserProcess.getByTitleAndUserID(user.id, process_title))
            return response.status(409).json({ message: Tools.errorMessages.userProcessAlreadyExist });
        const process = await Process.get(process_title);
        if (!process)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const user_process = await UserProcess.create(user.id, process.id, process.title);
        for (let i in questions) {
            if (!await Step.getById(questions[i].step_id))
                return response.status(404).json({ message: Tools.errorMessages.stepNotFound });
            await UserStep.create(user_process.id, questions[i].step_id, questions[i].response);
            if (questions[i].underQuestions && questions[i].underQuestions.length > 0) {
                for (let j in questions[i].underQuestions)
                    await UserUnderStep.add(user_process.id, questions[i].step_id, questions[i].underQuestions[j].response);
                let underStepNotDone = await UserUnderStep.getAllNotDoneByStepId(user_process.id, questions[i].step_id);
                let underStep = await UserUnderStep.getAllByStepId(user_process.id, questions[i].step_id); 
                if (underStepNotDone.length === 0 && underStep.length > 0)
                    await UserStep.update(user_process.id, questions[i].step_id, true);
                else if (underStepNotDone.length > 0 && underStep.length > 0)
                    await UserStep.update(user_process.id, questions[i].step_id, false);
            }
        }
        const notDone = await UserStep.getNotDone(user_process.id);
        if (notDone.length === 0)
            await UserProcess.update(user_process.id, process.id, true);
        else
            await UserProcess.update(user_process.id, process.id, false);
        return response.status(200).json({
            message: 'User process created!',
            response: user_process.id
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.post('/update', async (request, response) => {
    try {
        const { user_token, process_title, questions } = request.body;

        if (!user_token || !process_title || !questions)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user = await User.findToken(user_token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const process = await Process.get(process_title);
        if (!process)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const user_process = await UserProcess.get(user.id, process.id);
        if (!user_process)
            return response.status(404).json({ message: 'User process not found.' });
        let res = [];
        for (let i in questions) {
            if (!await Step.getById(questions[i].step_id))
                return response.status(404).json({ message: 'Step not found.' });
            if (questions[i].underQuestions && questions[i].underQuestions.length > 0) {
                for (let j in questions[i].underQuestions)
                    await UserUnderStep.update(user_process.id, questions[i].step_id, questions[i].underQuestions[j].id, questions[i].underQuestions[j].response);
            }
            let underStepNotDone = await UserUnderStep.getAllNotDoneByStepId(user_process.id, questions[i].step_id);
            let underStep = await UserUnderStep.getAllByStepId(user_process.id, questions[i].step_id); 
            if (questions[i].underQuestions && questions[i].underQuestions.length > 0 && underStepNotDone.length === 0 && underStep.length > 0)
                res.push(await UserStep.update(user_process.id, questions[i].step_id, true));
            else if (underStepNotDone.length > 0 && underStep.length > 0)
                res.push(await UserStep.update(user_process.id, questions[i].step_id, false));
            else
                res.push(await UserStep.update(user_process.id, questions[i].step_id, questions[i].response));
        }
        const notDone = await UserStep.getNotDone(user_process.id);
        let done = notDone.length === 0;
        await UserProcess.update(user_process.id, process.id, done);
        return response.status(200).json({
            message: 'User process updated!',
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.get('/delete', async (request, response) => {
    try {
        const { user_token, process_title } = request.query;

        if (!user_token || !process_title)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user = await User.findToken(user_token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const process = await Process.get(process_title);
        if (!process)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const user_process = await UserProcess.get(user.id, process.id);
        await UserUnderStep.deleteAll(user_process.id);
        await UserStep.deleteAll(user_process.id);
        const res = await UserProcess.delete(user.id, process.id);
        return response.status(200).json({
            message: 'User process deleted!',
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.get('/getUserSteps', async (request, response) => {
    try {
        const { user_token, process_title } = request.query;

        if (!user_token || !process_title)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user = await User.findToken(user_token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const process = await Process.get(process_title);
        if (!process)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const file = await Tools.getData(process.title);
        if (!file)
            return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        const user_process = await UserProcess.get(user.id, process.id);
        if (!user_process)
            return response.status(404).json({ message: Tools.errorMessages.userProcessNotFound });
        const data = file[user.language];
        const UserSteps = await UserStep.getAll(user_process.id);
        let res = [];
        for (let i in UserSteps) {
            let UserUnderSteps = await UserUnderStep.getAllByStepId(user_process.id, UserSteps[i].step_id);
            let k = Tools.getUnderSteps(i, data, UserSteps, UserUnderSteps);
            res.push({
                step_id: UserSteps[i].step_id,
                title: data.steps[i].title,
                description: data.steps[i].description,
                type: data.steps[i].type,
                source: data.steps[i].source,
                is_done: UserSteps[i].is_done,
                under_steps: k
            });
        }
        const pourcentage = await Tools.getPercentage(user_process.id);
        return response.status(200).json({
            message: 'User process steps',
            id: user_process.id,
            title: data.title,
            pourcentage: pourcentage,
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});
router.get('/getUserStepsById', async (request, response) => {
    try {
        const { user_process_id } = request.query;

        if (!user_process_id)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user_process = await UserProcess.getById(user_process_id);
        if (!user_process)
            return response.status(404).json({ message: Tools.errorMessages.userProcessNotFound });
        const user = await User.getById(user_process.user_id);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const process = await Process.getById(user_process.process_id);
        if (!process)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const file = await Tools.getData(process.title);
        if (!file)
            return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        const data = file[user.language];
        const UserSteps = await UserStep.getAll(user_process.id);
        let res = [];
        for (let i in UserSteps) {
            let UserUnderSteps = await UserUnderStep.getAllByStepId(user_process.id, UserSteps[i].step_id);
            let k = Tools.getUnderSteps(i, data, UserSteps, UserUnderSteps);
            res.push({
                step_id: UserSteps[i].step_id,
                title: data.steps[i].title,
                description: data.steps[i].description,
                type: data.steps[i].type,
                source: data.steps[i].source,
                is_done: UserSteps[i].is_done,
                under_steps: k
            });
        }
        const pourcentage = await Tools.getPercentage(user_process.id);
        return response.status(200).json({
            message: 'User process steps',
            id: user_process.id,
            title: data.title,
            pourcentage: pourcentage,
            response: res
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});
router.get('/getUserProcesses', async (request, response) => {
    try {
        const { user_token } = request.query;

        if (!user_token)
            return response.status(400).json({ message: Tools.errorMessages });
        const user = await User.findToken(user_token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const userProcesses = await UserProcess.getAll(user.id);
        let res = [];
        for (let i in userProcesses) {
            let process = await Process.getById(userProcesses[i].process_id);
            if (!process)
                return response.status(404).json({ message: Tools.errorMessages.processNotFound });
            const file = await Tools.getData(process.title);
            if (!file)
                return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
            let data = file[user.language];
            const percentage = await Tools.getPercentage(userProcesses[i].id);
            res.push({
                pourcentage: percentage,
                userProcess: {
                    id: userProcesses[i].id,
                    process_id: userProcesses[i].process_id,
                    title: data.title,
                    description: data.description,
                    source: data.source,
                    stocked_title: process.title,
                    is_done: userProcesses[i].is_done,
                }
            });  
        }
        return response.status(200).json({
            message: 'User processes',
            response: res
        });
    } catch (error) {
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

module.exports = router;