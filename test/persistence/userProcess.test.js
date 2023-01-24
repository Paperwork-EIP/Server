const rewire = require("rewire");
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

    describe("[UNIT TESTS]", () => {
        describe("[VALID TESTS]", () => {
            test("[userProcess.js] should have a user process component", async () => {
                expect(userProcess).not.toBeNull();
            });
            test("[CREATE] should be called", async () => {
                const spy = jest.spyOn(userProcess, "create");
                const create = await userProcess.create(user_id, process_id, process_title);

                expect(spy).toHaveBeenCalled();
                expect(create).not.toBeNull();
            });
            test("[CREATE] should define current date", async () => {
                const date = moduleUserProcess.__set__("currentDate", Date());
                const checkDate = moduleUserProcess.__get__("currentDate");

                expect(date).not.toBeNull();
                expect(checkDate).toBe(Date());
            });
            test("[UPDATE] should be called", async () => {
                const spy = jest.spyOn(userProcess, "update");
                const update = await userProcess.update(user_process_id, process_id);

                expect(spy).toHaveBeenCalled();
                expect(update).toBeNull();
            });
            test("[DELETE] should be called", async () => {
                const spy = jest.spyOn(userProcess, "delete");
                const deleteFn = await userProcess.delete(user_id, process_id);

                expect(spy).toHaveBeenCalled();
                expect(deleteFn).not.toBeNull();
            });
            test("[GET] should be called", async () => {
                const spy = jest.spyOn(userProcess, "get");
                const get = await userProcess.get(user_id, process_id);

                expect(spy).toHaveBeenCalled();
                expect(get).not.toBeNull();
            });
            test("[GET BY ID] should be called", async () => {
                const spy = jest.spyOn(userProcess, "getById");
                const getById = await userProcess.getById(user_process_id);

                expect(spy).toHaveBeenCalled();
                expect(getById).not.toBeNull();
            });
            test("[GET ALL] should be called", async () => {
                const spy = jest.spyOn(userProcess, "getAll");
                const getAll = await userProcess.getAll(user_id);

                expect(spy).toHaveBeenCalled();
                expect(getAll).not.toBeNull();
            });
        });
    });
});