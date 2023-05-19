const { Router } = require('express');
const fs = require('fs');
const moment = require('moment');
const UserProcess = require('../persistence/userProcess');
const Process = require('../persistence/process');
const User = require('../persistence/users');
const UserStep = require('../persistence/userStep');
const Step = require('../persistence/step');
const Calendar = require("../persistence/calendar");
const router = new Router();

moment().format(); 

router.post("/set", async (request, response) => {
    try {
        const { date, user_process_id, step_id } = request.body;
        const formats = [
            moment.ISO_8601,
            "MM/DD/YYYY  :)  HH*mm*ss"
        ];
        if (!date || !user_process_id || !step_id) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        if (!moment(date, formats, true).isValid()) {
            return response.status(400).json({ message: 'Invalid date format. '});
        }
        const user_process = await UserProcess.getById(user_process_id);
        if (!user_process) {
            return response.status(404).json({ message: 'User process not found.' });
        }
        const step = await Step.getById(step_id);
        if (!step) {
            return response.status(404).json({ message: 'Step not found.' });
        }
        const meeting = await Calendar.set(date, user_process_id, step_id);
        return response.status(200).json({ message: 'Meeting updated!', response: meeting });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "System error." });
    }
});

async function getMeeting(processes, language) {
    let res = [];
    for (let i in processes) {
        let process = await Process.getById(processes[i].process_id);
        if (!process) {
            return 'Process not found.';
        }
        let file;
        try {
            file = require('../data/' + process.title + '.json');
            if (!file) {
                return 'Data not found.';
            }
        } catch (error) {
            return 'Data not found.';
        }
        let data = file[language];
        let userStep = await UserStep.getAllAppoinment(processes[i].id);
        if (!userStep) {
            return 'User step not found.';
        }
        for (let j in userStep) {
            let step = await Step.getById(userStep[j].step_id);
            if (!step) {
                return 'Step not found.';
            } else {
                res.push({
                    "date": userStep[j].appoinment,
                    "user_process_id": userStep[j].user_process_id,
                    "process_title": data.title,
                    "step_id": userStep[j].step_id,
                    "step_title": data.steps[j].title,
                    "step_description": data.steps[j].description,
                });
            }
        }
    }
    return res;
}

router.get("/getAll", async (request, response) => {
    try {
        const { token } = request.query;
        if (!token) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = await User.findToken(token);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const processes = await UserProcess.getAll(user.id);
        if (!processes) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        let res = await getMeeting(processes, user.language);
        if (res === 'Process not found.' || res === 'User step not found.' || res === 'Step not found.' || res === 'Data not found.') {
            return response.status(404).json({ message: 'Process, step, user step or data not found.' });
        }
        return response.status(200).json({ message: "User appoinments.", appoinment: res });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "System error." });
    }
});

router.get("/getByPeriod", async (request, response) => {
    try {
        const { token, date } = request.query;
        if (!token || !date) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = await User.findToken(token);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const processes = await UserProcess.getAll(user.id);
        if (!processes) {
            return response.status(404).json({ message: 'Process not found.' });
        }
        let res = await getMeeting(processes, user.language);
        if (res === 'Process not found.' || res === 'User step not found.' || res === 'Step not found.' || res === 'Data not found.') {
            return response.status(404).json({ message: 'Process, step or user step not found.' });
        }
        let year;
        let month;
        let day;
        const invalidDate = date.split("-");
        year = parseInt(invalidDate[0]);
        month = parseInt(invalidDate[1]) - 1;
        day = parseInt(invalidDate[2]);
        let value = [];
        for (i in res) {
            if ((isNaN(year) || res[i].date.getFullYear() === year) && (isNaN(month) || res[i].date.getMonth() === month) && (isNaN(day) || res[i].date.getDate() === day)) {
                value.push(res[i]);
            }
        }
        return response.status(200).json({ message: "User appoinments.", appoinment: value });
    } catch (error) {
        return response.status(500).json({ message: "System error." });
    }
});

router.get("/delete", async (request, response) => {
    try {
        const { user_process_id, step_id } = request.query;
        if (!user_process_id || !step_id) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user_process = await UserProcess.getById(user_process_id);
        if (!user_process) {
            return response.status(404).json({ message: 'User process not found.' });
        }
        const step = await Step.getById(step_id);
        if (!step) {
            return response.status(404).json({ message: 'Step not found.' });
        }
        const res = await Calendar.set(null, user_process_id, step_id);
        return response.status(200).json({ message: 'Appoinment deleted.', res });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "System error." });
    }
});

module.exports = router;