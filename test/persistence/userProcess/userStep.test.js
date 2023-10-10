const db = require('../../../src/persistence/db');
const Step = require('../../../src/persistence/process/step');
const UserStep = require('../../../src/persistence/userProcess/userStep');
const init_db = require('../../../src/persistence/init-db');

beforeAll(async () => {
    await init_db.initAll();
});
afterEach(() => {
    jest.restoreAllMocks();
});

describe("User Step Persistence Tests", () => {
    it('[CREATE] should create a new user step', async () => {
        const user_process_id = 1;
        const step_id = 1;
        const is_done = true;
        const result = {
            id: 1,
            user_process_id: user_process_id,
            step_id: step_id,
            is_done: is_done,
        };
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        }

        Step.getById = jest.fn().mockReturnValue({
            title: 'Random Test',
            type: 'Test type',
            description: 'this is a test process',
            question: 'question',
            source: 'source',
            is_unique: true,
            delay: "2022-10-10 03:03:03",
            process_id: 5
        });
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserStep.create(user_process_id, step_id, is_done);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[CREATE] should return null if no step found', async () => {
        const user_process_id = 1;
        const step_id = 1;
        const is_done = true;

        Step.getById = jest.fn().mockReturnValue(null);
        const response = await UserStep.create(user_process_id, step_id, is_done);

        expect(response).toBeNull();
    });
    it('[CREATE] should return null if no step delay', async () => {
        const user_process_id = 1;
        const step_id = 1;
        const is_done = true;
        const result = {
            id: 1,
            user_process_id: user_process_id,
            step_id: step_id,
            is_done: is_done,
        };
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        }

        Step.getById = jest.fn().mockReturnValue({
            title: 'Random Test',
            type: 'Test type',
            description: 'this is a test process',
            question: 'question',
            source: 'source',
            is_unique: true,
            delay: null,
            process_id: 5
        });
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserStep.create(user_process_id, step_id, is_done);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[CREATE] should throw an error if an error occurs', async () => {
        jest.spyOn(Step, 'getById').mockResolvedValue(() => { new Error });
        await expect(UserStep.create()).rejects.toThrow();
    });
    it('[UPDATE] should update the user step id', async () => {
        const user_process_id = 1;
        const step_id = 2;
        const is_done = true;
        const result = {
            id: 1,
            user_process_id: user_process_id,
            step_id: step_id,
            is_done: is_done,
        };
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 2,
            is_done: true,
        }

        Step.getById = jest.fn().mockReturnValue({
            title: 'Random Test',
            type: 'Test type',
            description: 'this is a test process',
            question: 'question',
            source: 'source',
            is_unique: true,
            delay: "2022-10-10 03:03:03",
            process_id: 5
        });
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserStep.update(user_process_id, step_id, is_done);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[UPDATE] should update the user process id', async () => {
        const user_process_id = 2;
        const step_id = 1;
        const is_done = true;
        const result = {
            id: 1,
            user_process_id: user_process_id,
            step_id: step_id,
            is_done: is_done,
        };
        const expectedResponse = {
            id: 1,
            user_process_id: 2,
            step_id: 1,
            is_done: true,
        }

        Step.getById = jest.fn().mockReturnValue({
            title: 'Random Test',
            type: 'Test type',
            description: 'this is a test process',
            question: 'question',
            source: 'source',
            is_unique: true,
            delay: "2022-10-10 03:03:03",
            process_id: 5
        });
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserStep.update(user_process_id, step_id, is_done);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[UPDATE] should update the is done', async () => {
        const user_process_id = 1;
        const step_id = 1;
        const is_done = false;
        const result = {
            id: 1,
            user_process_id: user_process_id,
            step_id: step_id,
            is_done: is_done,
        };
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: false,
        }

        Step.getById = jest.fn().mockReturnValue({
            title: 'Random Test',
            type: 'Test type',
            description: 'this is a test process',
            question: 'question',
            source: 'source',
            is_unique: true,
            delay: "2022-10-10 03:03:03",
            process_id: 5
        });
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserStep.update(user_process_id, step_id, is_done);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[UPDATE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockReturnValue(() => { new Error });
        await expect(UserStep.update()).rejects.toThrow();
    });
    it('[DELETE ALL] should delete all user steps for a given user process id', async () => {
        const userProcessId = 1;
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        };

        db.query = jest.fn().mockReturnValue({ rows: [expectedResponse] });

        const response = await UserStep.deleteAll(userProcessId);

        expect(db.query).toHaveBeenCalled();
        expect(response).toBeTruthy();
        expect(response).toEqual(expectedResponse);
    });
    it('[DELETE ALL] should throw an error if something goes wrong', async () => {
        const user_process_id = 1;
        const expectedErrorMessage = 'Something went wrong';

        db.query = jest.fn().mockRejectedValue(new Error(expectedErrorMessage));

        try {
            await UserStep.deleteAll(user_process_id);
        } catch (error) {
            expect(error.message).toEqual(expectedErrorMessage);
        }
        expect(db.query).toHaveBeenCalled();
    });
    it('[GET BY ID] should return the user step with the given id', async () => {
        const userStepId = 1;
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        };

        db.query = jest.fn().mockResolvedValue({ rows: [expectedResponse] });

        const response = await UserStep.getById(userStepId);

        expect(db.query).toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });
    it('[GET BY STEP ID] should return the user step with the given user process and step id', async () => {
        const userStepId = 1;
        const stepId = 1;
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        };

        db.query = jest.fn().mockResolvedValue({ rows: [expectedResponse] });

        const response = await UserStep.getByStepId(userStepId, stepId);

        expect(db.query).toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });
    it('[GET ALL] should return the user step with the given user process id', async () => {
        const userProcessId = 1;
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        };

        db.query = jest.fn().mockResolvedValue({ rows: expectedResponse });

        const response = await UserStep.getAll(userProcessId);

        expect(db.query).toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });
    it('[GET ALL APPOINMENT] should return the user step with the given user process id', async () => {
        const userProcessId = 1;
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        };

        db.query = jest.fn().mockResolvedValue({ rows: expectedResponse });

        const response = await UserStep.getAllAppoinment(userProcessId);

        expect(db.query).toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });
    it('[GET NOT DONE] should return the user step with the given user process id', async () => {
        const userProcessId = 1;
        const expectedResponse = {
            id: 1,
            user_process_id: 1,
            step_id: 1,
            is_done: true,
        };

        db.query = jest.fn().mockResolvedValue({ rows: expectedResponse });

        const response = await UserStep.getNotDone(userProcessId);

        expect(db.query).toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });
});
