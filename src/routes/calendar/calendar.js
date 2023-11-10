const { Router } = require('express');
const fs = require('fs');
const moment = require('moment');
const UserProcess = require('../../persistence/userProcess/userProcess');
const Process = require('../../persistence/process/process');
const User = require('../../persistence/users/users');
const UserStep = require('../../persistence/userProcess/userStep');
const Step = require('../../persistence/process/step');
const Calendar = require("../../persistence/userProcess/calendar");
const Tools = require('../../tools');
const router = new Router();

moment().format(); 

router.post("/set", async (request, response) => {
    try {
        const { date, user_process_id, step_id } = request.body;
        const formats = [
            moment.ISO_8601,
            "MM/DD/YYYY  :)  HH*mm*ss"
        ];

        if (!date || !user_process_id || !step_id)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        if (!moment(date, formats, true).isValid())
            return response.status(400).json({ message: Tools.errorMessages.invalidDateFormat});
        const user_process = await UserProcess.getById(user_process_id);
        if (!user_process)
            return response.status(404).json({ message: Tools.errorMessages.userProcessNotFound });
        const step = await Step.getById(step_id);
        if (!step)
            return response.status(404).json({ message: Tools.errorMessages.stepNotFound });
        const meeting = await Calendar.set(date, user_process_id, step_id);
        return response.status(200).json({ message: 'Meeting updated!', response: meeting });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

async function getMettingBis(process, userStep, data) {
    let res = [];
    let i = 0;
    for (let j in userStep) {
        let userSteps = await UserStep.getAll(userStep[j].user_process_id);
        if (!userSteps)
            return Tools.errorMessages.stepNotFound;
        else {
            for (i = 0; userSteps[i] && userSteps[i].step_id != userStep[j].step_id; i++);
            res.push({
                "date": userStep[j].appoinment,
                "user_process_id": userStep[j].user_process_id,
                "process_title": data.title,
                "stocked_title": process.title,
                "step_id": userStep[j].step_id,
                "step_title": data.steps[i].title,
                "step_description": data.steps[i].description,
            });
        }
    }
    return res;
}

async function getMeeting(processes, language) {
    let value = [];
    let res;

    for (let i in processes) {
        let process = await Process.getById(processes[i].process_id);
        if (!process)
            return Tools.errorMessages.processNotFound;
        let file = await Tools.getData(process.title);
        if (!file)
            return Tools.errorMessages.dataNotFound;
        let data = file[language];
        let userStep = await UserStep.getAllAppoinment(processes[i].id);
        if (!userStep)
            return Tools.errorMessages.userStepNotFound;
        res = await getMettingBis(process, userStep, data);
        if (res === Tools.errorMessages.stepNotFound) {
            return res;
        }
        value = value.concat(res);
    }
    return value;
}

router.get("/getAll", async (request, response) => {
    try {
        const { token } = request.query;

        if (!token)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user = await User.findToken(token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const processes = await UserProcess.getAll(user.id);
        if (!processes)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        let res = await getMeeting(processes, user.language);
        if (res === Tools.errorMessages.processNotFound || res === Tools.errorMessages.userStepNotFound
            || res === Tools.errorMessages.stepNotFound || res === Tools.errorMessages.dataNotFound)
            return response.status(404).json({ message: 'Process, step, user step or data not found.' });
        return response.status(200).json({ message: "User appoinments.", appoinment: res });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.get("/getByPeriod", async (request, response) => {
    try {
        const { token, date } = request.query;
        let year, month, day, value = [];

        if (!token || !date)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user = await User.findToken(token);
        if (!user)
            return response.status(404).json({ message: Tools.errorMessages.userNotFound });
        const processes = await UserProcess.getAll(user.id);
        if (!processes)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        let res = await getMeeting(processes, user.language);
        if (res === Tools.errorMessages.processNotFound || res === Tools.errorMessages.userStepNotFound
            || res === Tools.errorMessages.stepNotFound || res === Tools.errorMessages.dataNotFound)
            return response.status(404).json({ message: 'Process, step or user step not found.' });
        const invalidDate = date.split("-");
        year = parseInt(invalidDate[0]);
        month = parseInt(invalidDate[1]) - 1;
        day = parseInt(invalidDate[2]);
        for (let i in res) {
            if ((isNaN(year) || res[i].date.getFullYear() === year) && (isNaN(month) || res[i].date.getMonth() === month) && (isNaN(day)
            || res[i].date.getDate() === day))
                value.push(res[i]);
        }
        return response.status(200).json({ message: "User appoinments.", appoinment: value });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.get("/delete", async (request, response) => {
    try {
        const { user_process_id, step_id } = request.query;

        if (!user_process_id || !step_id)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const user_process = await UserProcess.getById(user_process_id);
        if (!user_process)
            return response.status(404).json({ message: Tools.errorMessages.userProcessNotFound });
        const step = await Step.getById(step_id);
        if (!step)
            return response.status(404).json({ message: Tools.errorMessages.stepNotFound });
        const res = await Calendar.set(null, user_process_id, step_id);
        return response.status(200).json({ message: 'Appoinment deleted.', res });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

module.exports = router;