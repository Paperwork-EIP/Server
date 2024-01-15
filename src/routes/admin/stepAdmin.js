const { Router } = require('express');
const Process = require('../../persistence/process/process');
const Step = require('../../persistence/process/step');
const Tools = require('../../tools');
const router = new Router();
const path = require('path');
const Users = require('../../persistence/users/users');
const fs = require('fs');

function getUnderStepData(file, i, j) {
    let underQuestionsArray = [];
    for (let k in file[Object.keys(file)[i]].steps[j].underQuestions) {
        underQuestionsArray.push({
            id: k,
            title: file[Object.keys(file)[i]].steps[j].underQuestions[k].title,
            type: file[Object.keys(file)[i]].steps[j].underQuestions[k].type,
            description: file[Object.keys(file)[i]].steps[j].underQuestions[k].description,
            source: file[Object.keys(file)[i]].steps[j].underQuestions[k].source,
            question: file[Object.keys(file)[i]].steps[j].underQuestions[k].question
        });
    }
    return underQuestionsArray;
};

async function getStepData(stocked_title, step_id, allSteps) {
    let file = await Tools.getData(stocked_title);
    let step = [];
    for (let i in Object.keys(file)) {
        for (let j in allSteps) {
            if (allSteps[j].id == step_id) {
                let underQuestionsArray = getUnderStepData(file, i, j);
                step.push({
                    language: Object.keys(file)[i],
                    step_id: allSteps[j].id,
                    number: j,
                    content: {
                        title: file[Object.keys(file)[i]].steps[j].title,
                        type: file[Object.keys(file)[i]].steps[j].type,
                        description: file[Object.keys(file)[i]].steps[j].description,
                        question: file[Object.keys(file)[i]].steps[j].question,
                        source: file[Object.keys(file)[i]].steps[j].source,
                        delay: file[Object.keys(file)[i]].steps[j].delay,
                        underQuestions: underQuestionsArray
                    }
                });
            }
        }
    }
    return step;
};

router.get('/get', async(request, response) => {
    try {
        const { stocked_title, step_id, token } = request.query;

        if (!stocked_title || !step_id || !token)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const isAdmin = await Users.isAdmin(token);
        if (!isAdmin)
            return response.status(403).json({ message: Tools.errorMessages.unauthorized });
        const find = await Process.get(stocked_title);
        if (!find)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const target = await Step.getById(step_id);
        if (!target)
            return response.status(404).json({ message: Tools.errorMessages.stepNotFound });
        const allSteps = await Step.getByProcess(find.id);
        if (!allSteps)
            return response.status(404).json({ message: Tools.errorMessages.stepsNotFound });
        let step = await getStepData(stocked_title, step_id, allSteps);
        return response.status(200).json({
            message: 'Step found!',
            stocked_title: stocked_title,
            step: step
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.get('/getAll', async(reuest, response) => {
    const { stocked_title, language, token } = reuest.query;

    try {
        if (!stocked_title || !language || !token)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const isAdmin = await Users.isAdmin(token);
        if (!isAdmin)
            return response.status(403).json({ message: Tools.errorMessages.unauthorized });
        const find = await Process.get(stocked_title);
        if (!find)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const allSteps = await Step.getByProcess(find.id);
        if (!allSteps)
            return response.status(404).json({ message: Tools.errorMessages.stepsNotFound });
        const file = await Tools.getData(stocked_title);
        if (!file)
            return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        let steps = [];
        for (let i in allSteps)
            steps.push({ id: allSteps[i].id, title: file[language].steps[i].title });
        return response.status(200).json({
            message: 'Steps found!',
            stocked_title: stocked_title,
            steps: steps
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.post('/add', async(request, response) => {
    try {
        const { stocked_title, delay, newStep, is_unique = false, token } = request.body;

        if (!stocked_title || !newStep || !token)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const isAdmin = await Users.isAdmin(token);
        if (!isAdmin)
            return response.status(403).json({ message: Tools.errorMessages.unauthorized });
        if (!Tools.checkStepContent(newStep))
            return response.status(400).json({ message: 'Missing data in the new step.' });
        const find = await Process.get(stocked_title);
        if (!find)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const filePath = path.join(__dirname, '../../data', `${stocked_title}.json`);
        let file;
        try {
            file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!file)
                return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
            for (let i in Object.keys(file))
                file[Object.keys(file)[i]].steps.push(newStep);
            const jsonData = JSON.stringify(file, null, 2);
            let res = await Step.create(delay, find.id, is_unique);
            fs.writeFile(filePath, jsonData, function(err, result) {
                if (err) {
                    (async() => {
                        await Step.delete(res.id);
                        response.status(500).json({ message: Tools.errorMessages.errWritingFile });
                    })();
                } else {
                    response.status(200).json({
                        message: 'Step added!',
                        stocked_title: stocked_title,
                        id: res.id,
                        step: newStep
                    });
                }
            });
        } catch (error) {
            return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.post('/modify', async(request, response) => {
    try {
        const { stocked_title, step_id, language, delay = 0, newStep, is_unique = false, token } = request.body;

        if (!stocked_title || !step_id || !language || !newStep || !token)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const isAdmin = await Users.isAdmin(token);
        if (!isAdmin)
            return response.status(403).json({ message: Tools.errorMessages.unauthorized });
        const find = await Process.get(stocked_title);
        if (!find)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const target = await Step.getById(step_id);
        if (!target)
            return response.status(404).json({ message: Tools.errorMessages.stepNotFound });
        if (delay)
            await Step.update(step_id, delay, is_unique);
        const allSteps = await Step.getByProcess(find.id);
        if (!allSteps)
            return response.status(404).json({ message: Tools.errorMessages.stepsNotFound });
        const filePath = path.join(__dirname, '../../data', `${stocked_title}.json`);
        let file;
        try {
            file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!file)
                return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
            let j = allSteps.findIndex((step) => step.id == step_id);
            if (newStep.title)
                file[language].steps[j].title = newStep.title;
            if (newStep.type)
                file[language].steps[j].type = newStep.type;
            if (newStep.description)
                file[language].steps[j].description = newStep.description;
            if (newStep.question)
                file[language].steps[j].question = newStep.question;
            if (newStep.source)
                file[language].steps[j].source = newStep.source;
            let step = file[language].steps[j];
            const jsonData = JSON.stringify(file, null, 2);
            fs.writeFile(filePath, jsonData, function(err, result) {
                if (err)
                    return response.status(500).json({ message: Tools.errorMessages.errWritingFile });
            });
            return response.status(200).json({
                message: 'Step updated!',
                stocked_title: stocked_title,
                step: step
            });
        } catch (error) {
            return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.get('/delete', async(request, response) => {
    try {
        const { stocked_title, step_id, token } = request.query;

        if (!stocked_title || !step_id || !token)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const isAdmin = await Users.isAdmin(token);
        if (!isAdmin)
            return response.status(403).json({ message: Tools.errorMessages.unauthorized });
        const find = await Process.get(stocked_title);
        if (!find)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        const target = await Step.getById(step_id);
        if (!target)
            return response.status(404).json({ message: Tools.errorMessages.stepNotFound });
        const allSteps = await Step.getByProcess(find.id);
        if (!allSteps)
            return response.status(404).json({ message: Tools.errorMessages.stepsNotFound });
        const filePath = path.join(__dirname, '../../data', `${stocked_title}.json`);
        let file;
        try {
            file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!file)
                return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
            const j = allSteps.findIndex((step) => step.id == step_id);
            for (let i in Object.keys(file))
                file[Object.keys(file)[i]].steps.splice(j, 1);
            const jsonData = JSON.stringify(file, null, 2);
            fs.writeFile(filePath, jsonData, function(err, result) {
                if (err)
                    return response.status(500).json({ message: Tools.errorMessages.errWritingFile });
            });
            await Step.delete(step_id);
            return response.status(200).json({
                message: 'Step deleted!',
                stocked_title: stocked_title,
                step_id: step_id
            });
        } catch (error) {
            return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

module.exports = router;
module.exports.getStepData = getStepData;
module.exports.getUnderStepData = getUnderStepData;