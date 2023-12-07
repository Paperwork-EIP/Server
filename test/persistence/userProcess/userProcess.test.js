const rewire = require("rewire");
const db = require('../../../src/persistence/db');
const Process = require("../../../src/persistence/process/process");
const userProcess = require("../../../src/persistence/userProcess/userProcess");
const init_db = require('../../../src/persistence/init-db');

beforeAll(async() => {
    await init_db.initAll();
});
afterEach(() => {
    jest.restoreAllMocks();
});

describe("User Process Persistence Tests", () => {
    const user_id = 1234234234;
    const user_process_id = 11231231;
    const process_id = 1234234;
    const process_title = "testtesttesttesttesttest";
    const moduleUserProcess = rewire("../../../src/persistence/userProcess/userProcess");

    it("[userProcess.js] should have a user process component", async() => {
        expect(userProcess).not.toBeNull();
    });
    it("[CREATE] should be called", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const spy = jest.spyOn(userProcess, "create");
        const create = await userProcess.create(user_id, process_id, process_title);

        expect(spy).toHaveBeenCalled();
        expect(create).not.toBeNull();
    });
    it("[CREATE] should define current date", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const date = moduleUserProcess.__set__("currentDate", Date());
        const checkDate = moduleUserProcess.__get__("currentDate");

        expect(date).not.toBeNull();
        expect(checkDate).toBe(Date());
    });
    it('[CREATE] should throw an error if an error occurs', async() => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(userProcess.create()).rejects.toThrow();
    });
    it("[UPDATE] should be called", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        Process.getById = jest.fn().mockReturnValue({ delay: "2022-10-10 10:10:10" });

        const spy = jest.spyOn(userProcess, "update");
        const update = await userProcess.update(user_process_id, process_id);

        expect(spy).toHaveBeenCalled();
        expect(update).not.toBeNull();
    });
    it("[UPDATE] should define process delay", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        Process.getById = jest.fn().mockReturnValue({ delay: "2022-10-10 10:10:10" });
        jest.spyOn(db, 'query').mockReturnValue({
            rows: [{ id: 1, user_id: user_id, process_id: process_id }]
        });

        const currentDate = new Date();

        const expire_date = new Date();
        expire_date.setFullYear(expire_date.getFullYear() + 1);
        expire_date.setMonth(expire_date.getMonth() + 2);
        expire_date.setDate(expire_date.getDate() + 3);
        const response = await userProcess.update(user_id, process_id, process_title);

        expect(Process.getById).toBeCalledWith(process_id);
        expect(currentDate).toBeDefined();
        expect(expire_date).toBeDefined();
        expect(response).toEqual({ id: 1, user_id: user_id, process_id: process_id });
    });
    it('[UPDATE] should return null if no process found', async() => {
        const result = null;

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        jest.spyOn(Process, 'getById').mockResolvedValueOnce(null);

        const response = await userProcess.update(1, 1);

        expect(response).toBeNull();
    });
    it('[UPDATE] should return null if invalid process delay', async() => {
        const result = null;

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        jest.spyOn(Process, 'getById').mockReturnValue({ delay: null });

        const response = await userProcess.update(1, 1);

        expect(response).toBeNull();
    });
    it('[UPDATE] should throw an error if an error occurs', async() => {
        jest.spyOn(db, 'query').mockResolvedValueOnce(() => { throw new Error() });
        await expect(userProcess.update()).rejects.toThrow();
    });
    it("[DELETE] should be called", async() => {
        const spy = jest.spyOn(userProcess, "delete");
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });

        const deleteFn = await userProcess.delete(user_id, process_id);

        expect(spy).toHaveBeenCalled();
        expect(deleteFn).not.toBeNull();
    });
    it('[DELETE] should throw an error if an error occurs', async() => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(userProcess.delete()).rejects.toThrow();
    });
    it("[DELETE ALL] should be called", async() => {
        const spy = jest.spyOn(userProcess, "deleteAll");
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });

        const deleteFn = await userProcess.deleteAll(user_id, process_id);

        expect(spy).toHaveBeenCalled();
        expect(deleteFn).not.toBeNull();
    });
    it('[DELETE] should throw an error if an error occurs', async() => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(userProcess.deleteAll()).rejects.toThrow();
    });
    it("[GET] should be called", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const spy = jest.spyOn(userProcess, "get");
        const get = await userProcess.get(user_id, process_id);

        expect(spy).toHaveBeenCalled();
        expect(get).not.toBeNull();
    });
    it("[GET BY ID] should be called", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const spy = jest.spyOn(userProcess, "getById");
        const getById = await userProcess.getById(user_process_id);

        expect(spy).toHaveBeenCalled();
        expect(getById).not.toBeNull();
    });
    it("[GET ALL] should be called", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const spy = jest.spyOn(userProcess, "getAll");
        const getAll = await userProcess.getAll(user_id);

        expect(spy).toHaveBeenCalled();
        expect(getAll).not.toBeNull();
    });
    it("[getByTitleAndUserID] should be called", async() => {
        const result = {
            id: 1,
            user_id: user_id
        };

        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const spy = jest.spyOn(userProcess, "getByTitleAndUserID");
        const getByTitleAndUserID = await userProcess.getByTitleAndUserID(user_id, process_title);

        expect(spy).toHaveBeenCalled();
        expect(getByTitleAndUserID).not.toBeNull();
    });
});