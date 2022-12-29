const { Router } = require('express');
const UserProcess = require('../persistence/userProcess');
const User = require('../persistence/users');
const Process = require('../persistence/process');
const Step = require('../persistence/step');
const UserStep = require('../persistence/userStep');
const Calendar = require("../persistence/calendar");
const router = new Router();

router.post("/set", async (request, response) => {
    try {
        const { date, user_process_id, step_id } = request.body;
        if (!date || !user_process_id || !step_id) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user_process = await UserProcess.getById(user_process_id);
        if (!user_process) {
            return response.status(404).json({ message: 'User process not found.' });
        }
        const meeting = await Calendar.set(date, user_process_id, step_id);
        if (!meeting) {
            return response.status(404).json({ message: 'Meeting not found. '});
        }
        return response.status(200).json({ message: 'Meeting updated!', response: meeting });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "System error." });
    }
});

router.get("/getAll", async (request, response) => {
    try {
        const { email } = request.query;
        if (!email) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const user = User.find(email);
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }
        const processes = UserProcess.getAll(user.id);
        if (!processes) {
            return response.status(404).json({ message: 'Process not found.'});
        }
        let res = [];
        for (let i in processes) {
            let userStep = UserStep.getAllAppoinment(processes[i].id);
            if (userStep) {
                res.push({
                    "date": userStep.appoinment,
                    "user_process_id": userStep.user_process_id,
                    "step_id": userStep.step_id
                });
            }
        }
        return response.status(200).json({ message: "User appoinments.", appoinment: res });
    } catch (error) {
        console.log(error);
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
        } else {
            const res = await Calendar.set(null, user_process_id, step_id);
            return response.status(200).json({ message: 'Appoinment deleted.', res });
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "System error." });
    }
});

module.exports = router;