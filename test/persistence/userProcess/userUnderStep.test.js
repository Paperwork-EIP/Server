const db = require('../../../src/persistence/db');
const UserUnderStep = require('../../../src/persistence/userProcess/userUnderStep');
const init_db = require('../../../src/persistence/init-db');

beforeAll(async () => {
    await init_db.initAll();
});
afterEach(() => {
    jest.restoreAllMocks();
});

describe("User Under Step Persistence Tests", () => {
    const user_process_id = 1;
    const step_id = 1;
    const is_done = true;

    it('[ADD] should add a new under step', async () => {
        const result = {
            id: 1,
            step_id: step_id
        };
        const expectedResponse = {
            id: 1,
            step_id: step_id
        }
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserUnderStep.add(user_process_id, step_id, is_done);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[ADD] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(UserUnderStep.add()).rejects.toThrow();
    });
    it('[UPDATE] should add a new under step', async () => {
        const result = {
            id: 1,
            step_id: step_id
        };
        const expectedResponse = {
            id: 1,
            step_id: step_id
        }
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserUnderStep.update(user_process_id, step_id, is_done);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[UPDATE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(UserUnderStep.update()).rejects.toThrow();
    });
    it('[DELETE] should delete an under step', async () => {
        const result = {
            id: 1,
            step_id: step_id
        };
        const expectedResponse = {
            id: 1,
            step_id: step_id
        }
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserUnderStep.add(user_process_id);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[DELETE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(UserUnderStep.deleteAll()).rejects.toThrow();
    });
});