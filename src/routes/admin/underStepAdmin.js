const { Router } = require('express');
const Process = require('../../persistence/process/process');
const Step = require('../../persistence/process/step');
const Tools = require('../../tools');
const router = new Router();
const path = require('path');
const fs = require('fs');

router.get('/getAll', async (reuest, response) => {
    const { stocked_title, language, step_id } = reuest.query;

    if (!stocked_title || !language)
        return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const find = await Process.get(stocked_title);
    if (!find)
        return response.status(404).json({ message: Tools.errorMessages.processNotFound });
    const allSteps = await Step.getByProcess(find.id);
    if (!allSteps)
        return response.status(404).json({ message: Tools.errorMessages.stepsNotFound });
    const file = await Tools.getData(stocked_title);
    if (!file)
        return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
    let underSteps = [];
    const i = allSteps.findIndex((step) => step.id == step_id);
    for (let j in file[language].steps[i].underQuestions)
        underSteps.push({ id: j, title: file[language].steps[i].underQuestions[j].title });
    return response.status(200).json({
        message: 'Steps found!',
        stocked_title: stocked_title,
        step_id: step_id,
        underSteps: underSteps
    });
});

router.post('/add', async (request, response) => {
    try {
        const { stocked_title, step_id, newUnderStep } = request.body;

        if (!stocked_title || !step_id || !newUnderStep)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        if (!Tools.checkStepContent(newUnderStep))
            return response.status(400).json({ message: 'Missing data in the new step.' });
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
        let res = [];
        try {
            file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!file)
                return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
            const j = allSteps.findIndex((step) => step.id == step_id);
            for (let i in Object.keys(file)) {
                console.log(file[Object.keys(file)[i]].steps[j]);
                file[Object.keys(file)[i]].steps[j].underQuestions.push(newUnderStep);
                res.push(file[Object.keys(file)[i]].steps[j]);
            }
            const jsonData = JSON.stringify(file, null, 2);
            fs.writeFile(filePath, jsonData, function (err, result) {
                if (err)
                    return response.status(500).json({ message: Tools.errorMessages.errWritingFile });
                return response.status(200).json({
                    message: 'UnderStep added!',
                    stocked_title: stocked_title,
                    step_id: step_id,
                    step: res
                });
            });
        } catch (error) {
        return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.post('/modify', async (request, response) => {
    const { stocked_title, step_id, underStep_id, newUnderStep, language } = request.body;

    if (!stocked_title || !step_id || (!underStep_id && underStep_id != 0) || !newUnderStep || !language)
        return response.status(400).json({ message: Tools.errorMessages.missingParameters });
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
        if (newUnderStep.title)
            file[language].steps[j].underQuestions[underStep_id].title = newUnderStep.title;
        if (newUnderStep.description)
            file[language].steps[j].underQuestions[underStep_id].description = newUnderStep.description;
        if (newUnderStep.source)
            file[language].steps[j].underQuestions[underStep_id].source = newUnderStep.source;
        if (newUnderStep.type)
            file[language].steps[j].underQuestions[underStep_id].type = newUnderStep.type;
        if (newUnderStep.question)
            file[language].steps[j].underQuestions[underStep_id].question = newUnderStep.question;
        const jsonData = JSON.stringify(file, null, 2);
        fs.writeFile(filePath, jsonData, function (err, result) {
            if (err)
                return response.status(500).json({ message: Tools.errorMessages.errWritingFile });
            return response.status(200).json({
                message: 'UnderStep modified!',
                stocked_title: stocked_title,
                step_id: step_id,
                underStep_id: underStep_id,
                step: file[language].steps[j].underQuestions[underStep_id]
            });
        });
    } catch (error) {
        return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
    }
});

router.get('/delete', async (request, response) => {
    try {
        const { stocked_title, step_id, underStep_id } = request.query;

        if (!stocked_title || !step_id || !underStep_id)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
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
            file[Object.keys(file)[i]].steps[j].underQuestions.splice(underStep_id, 1);
        const jsonData = JSON.stringify(file, null, 2);
        fs.writeFile(filePath, jsonData, function (err, result) {
            if (err)
            return response.status(500).json({ message: Tools.errorMessages.errWritingFile });
        });
        return response.status(200).json({
            message: 'UnderStep deleted!',
            stocked_title: stocked_title,
            step_id: step_id,
            underStep_id: underStep_id
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