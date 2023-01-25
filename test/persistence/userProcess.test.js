const rewire = require("rewire");
const db = require('../../src/persistence/db');
const Process = require("../../src/persistence/process");
const userProcess = require("../../src/persistence/userProcess");

afterEach(() => {
    jest.restoreAllMocks();
});

describe("User Process Persistence Tests", () => {
    const user_id = 1234234234;
    const user_process_id = 11231231;
    const process_id = 1234234;
    const process_title = "testtesttesttesttesttest";
    const moduleUserProcess = rewire("../../src/persistence/userProcess");

    it("[userProcess.js] should have a user process component", async () => {
        expect(userProcess).not.toBeNull();
    });
    it("[CREATE] should be called", async () => {
        const spy = jest.spyOn(userProcess, "create");
        const create = await userProcess.create(user_id, process_id, process_title);

        expect(spy).toHaveBeenCalled();
        expect(create).not.toBeNull();
    });
    it("[CREATE] should define current date", async () => {
        const date = moduleUserProcess.__set__("currentDate", Date());
        const checkDate = moduleUserProcess.__get__("currentDate");

        expect(date).not.toBeNull();
        expect(checkDate).toBe(Date());
    });
    it('[CREATE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { throw new Error });
        await expect(userProcess.create()).rejects.toThrow();
    });
    it("[UPDATE] should be called", async () => {
        const spy = jest.spyOn(userProcess, "update");
        const update = await userProcess.update(user_process_id, process_id);

        expect(spy).toHaveBeenCalled();
        expect(update).toBeNull();
    });
    it('[UPDATE] should return null if no process found', async () => {
        jest.spyOn(Process, 'getById').mockResolvedValueOnce(null);

        const response = await userProcess.update(1, 1);

        expect(response).toBeNull();
    });
    it('[UPDATE] should return null if invalid process delay', async () => {
        jest.spyOn(Process, 'getById').mockReturnValue({ delay: null });

        const response = await userProcess.update(1, 1);

        expect(response).not.toBeDefined();
    });
    it('[UPDATE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { throw new Error });
        await expect(userProcess.update()).rejects.toThrow();
    });
    it("[DELETE] should be called", async () => {
        const spy = jest.spyOn(userProcess, "delete");
        const deleteFn = await userProcess.delete(user_id, process_id);

        expect(spy).toHaveBeenCalled();
        expect(deleteFn).not.toBeNull();
    });
    it('[DELETE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { throw new Error });
        await expect(userProcess.delete()).rejects.toThrow();
    });
    it("[GET] should be called", async () => {
        const spy = jest.spyOn(userProcess, "get");
        const get = await userProcess.get(user_id, process_id);

        expect(spy).toHaveBeenCalled();
        expect(get).not.toBeNull();
    });
    it("[GET BY ID] should be called", async () => {
        const spy = jest.spyOn(userProcess, "getById");
        const getById = await userProcess.getById(user_process_id);

        expect(spy).toHaveBeenCalled();
        expect(getById).not.toBeNull();
    });
    it("[GET ALL] should be called", async () => {
        const spy = jest.spyOn(userProcess, "getAll");
        const getAll = await userProcess.getAll(user_id);

        expect(spy).toHaveBeenCalled();
        expect(getAll).not.toBeNull();
    });
});