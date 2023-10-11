const { Router } = require('express');
const Process = require('../../persistence/process/process');
const Step = require('../../persistence/process/step');
const Tools = require('../../tools');
const router = new Router();
  
router.post('/add', async (request, response) => {
    try {
        const { is_unique, delay, process_title } = request.body;

        if (!process_title)
            return response.status(400).json({ message: Tools.errorMessages.missingParameters });
        const process = await Process.get(process_title);
        if (!process)
            return response.status(404).json({ message: Tools.errorMessages.processNotFound });
        let file = await Tools.getData(process_title);
        if (!file)
            return response.status(404).json({ message: Tools.errorMessages.dataNotFound });
        const steps = await Step.getByProcess(process.id);
        if (Object.keys(steps).length >= Object.keys(file.english.steps).length)
            return response.status(404).json({ message: 'There is no more step to create for this process.' });
        const res = await Step.create(delay, process.id, is_unique);
        return response.status(200).json({
            message: 'Step created!',
            response: res 
        });
    } catch (error) {
        return response.status(500).json({ message: Tools.errorMessages.systemError });
    }
});

router.get('/deleteall', async (request, response) => {
try {
    const { process_title } = request.query;

    if (!process_title)
        return response.status(400).json({ message: Tools.errorMessages.missingParameters });
    const process = await Process.get(process_title);
    if (!process)
        return response.status(404).json({ message: Tools.errorMessages.processNotFound });
    const res = await Step.deleteAll(process.id);
    return response.status(200).json({
        message: 'Steps delete!',
        response: res 
    });
} catch (error) {
    return response.status(500).json({ message: Tools.errorMessages.systemError });
}
});

module.exports = router;