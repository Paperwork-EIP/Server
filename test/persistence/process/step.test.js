const Step = require('../../../src/persistence/process/step');
const db = require('../../../src/persistence/db');
const init_db = require('../../../src/persistence/init-db');

beforeAll(async () => {
    await init_db.initAll();
});

describe("Step Persistence Tests", () => {
    it('[CREATE] should create a step', async () => {
        const is_unique = true;
        const delay = new Date();
        const process_id = 5;

        const response = await Step.create(delay, process_id, is_unique);

        expect(response).toEqual({
            id: expect.any(Number)
        });
    });
    it('[CREATE] should throw an error if 0 arguments', async () => {
        await expect(Step.create()).rejects.toThrow();
    });
    it('[CREATE] should throw an error if 1 arguments', async () => {
        await expect(Step.create('delay')).rejects.toThrow();
    });
    it('[CREATE] should throw an error if 2 arguments with delay', async () => {
        await expect(Step.create('is_unique', 'delay')).rejects.toThrow();
    });
    it('[DELETE ALL] should delete the process step with the given id', async () => {
        const is_unique = true;
        const delay = new Date();
        const process_id = 7;

        const create_response = await Step.create(delay, process_id, is_unique);
        const response = await Step.deleteAll(create_response.process_id);

        expect(create_response).not.toBeNull();
        expect(response).not.toBeNull();
    });
    it('[DELETE ALL] should throw an error if invalid id', async () => {
        const id = 645675471;

        try {
            await Step.deleteAll(id);
        } catch (error) {
            expect(error).not.toBeNull();
            expect(error).toEqual('Error');
        }
    });
    it('[DELETE ALL] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockRejectedValueOnce(() => { throw new Error });
        await expect(Step.deleteAll()).rejects.toThrow();
    });
    it('[GET BY PROCESS] should return the step with the given process id', async () => {
        const process_id = 7;
        const response = await Step.getByProcess(process_id);

        expect(response && typeof response === 'object').toBe(true);
    });
    it('[GET BY ID] should return the step with the given process id', async () => {
        const id = 7;
        const response = await Step.getById(id);

        expect(response).not.toBeNull();
    });
});