const { getUnderSteps, getPercentage, getData, checkStepContent } = require('../src/tools');
const UserStep = require('../src/persistence/userProcess/userStep');

jest.mock('../src/persistence/userProcess/userStep', () => ({
    getAll: jest.fn(),
    getNotDone: jest.fn(),
}));

describe('Tools', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getUnderSteps', () => {
        it('should return an array of under steps with valid input', async() => {
            const i = 0;
            const data = {
                steps: [{
                    underQuestions: [{
                        title: 'Title1',
                        description: 'Description1',
                        type: 'Type1',
                        source: 'Source1',
                    }, ],
                }, ],
            };
            const UserSteps = [{ step_id: 1 }];
            const UserUnderSteps = [{ step_id: 1, id: 1, is_done: true }];

            const result = getUnderSteps(i, data, UserSteps, UserUnderSteps);

            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('id', 1);
            expect(result[0]).toHaveProperty('title', 'Title1');
            expect(result[0]).toHaveProperty('description', 'Description1');
            expect(result[0]).toHaveProperty('type', 'Type1');
            expect(result[0]).toHaveProperty('source', 'Source1');
            expect(result[0]).toHaveProperty('is_done', true);
        });

        it('should return an empty array if UserUnderSteps is empty', async() => {
            const i = 0;
            const data = {
                steps: [{
                    underQuestions: [{
                        title: 'Title1',
                        description: 'Description1',
                        type: 'Type1',
                        source: 'Source1',
                    }, ],
                }, ],
            };
            const UserSteps = [{ step_id: 1 }];
            const UserUnderSteps = [];

            const result = getUnderSteps(i, data, UserSteps, UserUnderSteps);

            expect(result).toHaveLength(0);
        });
    });

    describe('getPercentage', () => {
        it('should calculate the percentage correctly with valid input', async() => {
            const user_process_id = 1;
            const totalSteps = 10;
            const notDoneSteps = 2;

            UserStep.getAll.mockResolvedValue(new Array(totalSteps).fill({}));
            UserStep.getNotDone.mockResolvedValue(new Array(notDoneSteps).fill({}));

            const result = await getPercentage(user_process_id);

            expect(result).toEqual(80);
        });
    });

    describe('getData', () => {
        it('should return data for a valid title', async() => {
            const title = 'validTitle';

            const result = getData(title);

            expect(result).not.toBeNull();
        });
    });

    describe('checkStepContent', () => {
        it('should return true for a valid step', async() => {
            const step = {
                underQuestions: [],
                title: 'Title',
                type: 'Type',
                description: 'Description',
                question: 'Question',
                source: 'Source',
            };

            const result = checkStepContent(step);

            expect(result).toBe(true);
        });

        it('should return false for an invalid step', async() => {
            const step = {
                underQuestions: [],
            };

            const result = checkStepContent(step);

            expect(result).toBe(false);
        });

        it('should handle missing underQuestions', async() => {
            const step = {
                title: 'Title',
                type: 'Type',
                description: 'Description',
                question: 'Question',
                source: 'Source',
            };

            const result = checkStepContent(step);

            expect(result).toBe(true);
        });
    });
});