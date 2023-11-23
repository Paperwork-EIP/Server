const UserStep = require('./persistence/userProcess/userStep');

module.exports = {
    errorMessages: {
        missingParameters: 'Missing parameters.',
        userNotFound: 'User not found.',
        processNotFound: 'Process not found.',
        processProposalNotFound: 'Process proposal not found.',
        userProcessNotFound: 'User process not found.',
        dataNotFound: 'Data not found.',
        stepsNotFound: 'Steps not found.',
        stepNotFound: 'Step not found.',
        processAlreadyExist: 'Process already exist.',
        userProcessAlreadyExist: 'User process already exist.',
        systemError: 'System error.',
        invalidDateFormat: 'Invalid date format.',
        userStepNotFound: 'User step not found.',
        errWritingFile: 'Error writing file.',
        languageAlreadyExists: 'Language already exists.',
        processAlreadyExists: 'Process already exists.',
        languageNotFound: 'Language not found.',
    },
    getUnderSteps(i, data, UserSteps, UserUnderSteps) {
        let k = [];

        if (UserUnderSteps.length > 0) {
            for (let j in UserUnderSteps) {
                if (UserUnderSteps[j].step_id === UserSteps[i].step_id) {
                    k.push({
                        id: UserUnderSteps[j].id,
                        title: data.steps[i].underQuestions[j].title,
                        description: data.steps[i].underQuestions[j].description,
                        type: data.steps[i].underQuestions[j].type,
                        source: data.steps[i].underQuestions[j].source,
                        is_done: UserUnderSteps[j].is_done,
                    });
                }
            }
        }
        return k;
    },
    async getPercentage(user_process_id) {
        const res = await UserStep.getAll(user_process_id);
        const notDone = await UserStep.getNotDone(user_process_id);
        const x = (res.length - notDone.length) / res.length * 100;
        const pourcentage = Math.round(x);

        return pourcentage;
    },
    async getData(title) {
        try {
            return require(`./data/${title}.json`);
        } catch (error) {
            return null;
        }
    },
    checkStepContent(step) {
        if (!step.underQuestions)
            step.underQuestions = [];
        if (!step.title || !step.type || !step.description || !step.question || !step.source)
            return false;
        return true;
    }
}