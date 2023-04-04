const request = require("supertest");
const sinon = require("sinon");
const router = require("../../src/process/index");
const routerCalendar = require("../../src/process/calendar");
const UserProcess = require("../../src/persistence/userProcess");
const Process = require("../../src/persistence/process");
const Step = require("../../src/persistence/step");
const Users = require("../../src/persistence/users");
const Calendar = require("../../src/persistence/calendar");
const UserStep = require("../../src/persistence/userStep");
const { start, stop } = require("../../index");

describe("Calendar tests", () => {
    const port = 3009;
    let server;

    const date = "2011-11-11 20:20:20";

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
    });

    beforeAll(() => {
        server = start(port);
    });

    afterAll(() => {
        stop();
    });

    describe("[UNIT TESTS]", () => {
        test("[index.js] should have a router component", () => {
            expect(router).not.toBeNull();
        });
        test("[index.js] should have instanced the router component", () => {
            expect(router).toBeDefined();
        });
        test("[process.js] should have a router component", () => {
            expect(routerCalendar).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", () => {
            expect(routerCalendar).toBeDefined();
        });
    });
    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID CALENDAR TESTS]", () => {
            test("[SET] should add a meeting in calendar table with a 200 status code", async () => {
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ id: 1 });
                Calendar.set = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/calendar/set").send({
                    date: date,
                    user_process_id: 1,
                    step_id: 1
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("Meeting updated!");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET ALL] should get all meeting from calendar table with a 200 status code", async () => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.getAll = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue({ title: 'title' });
                Step.getById = jest.fn().mockReturnValue({ title: 'title' });
                UserStep.getAllAppoinment = jest.fn().mockReturnValue([{ step_id: 1, appoinment: 1, user_process_id: 1 }]);


                const response = await request(server).get("/calendar/getAll").query({
                    token: "hbjhbj"
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("User appoinments.");
                expect(response._body.appoinment).not.toBeNull();
            });
            test("[DELETE] should delete a meeting from calendar table with a 200 status code", async () => {
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ title: 'test' });
                Calendar.set = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: 1,
                    step_id: 1
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("Appoinment deleted.");
                expect(response._body.response).not.toBeNull();
            });
        });
        describe("[INVALID CALENDAR TESTS]", () => {
            test("[SET] date missing : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date empty : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid year : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "aaaa-11-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid year : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2aaa-11-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid year : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "a0aa-11-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid year : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "aa2a-11-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid year : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "aaa2-11-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid month : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-aa-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid month : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-1a-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid month : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-a1-11 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid day : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-aa 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid day : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-1a 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid day : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-a1 20:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid hour : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 aa:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid hour : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 1a:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid hour : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 a1:20:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid minute : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:aa:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid minute : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:1a:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid minute : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:a1:20",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid second : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:20:aa",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid second : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:20:1a",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] date invalid second : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:20:a1",
                    user_process_id: "test",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] user process id missing : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2005-10-22 03:01:50",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] user process id empty : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2005-10-22 03:01:50",
                    user_process_id: "",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] user process id not found : should not set a meeting in calendar table with a 404 status code", async () => {
                UserProcess.getById = jest.fn().mockReturnValue(null);
                const response = await request(server).post("/calendar/set").send({
                    date: date,
                    user_process_id: 'qweqw',
                    step_id: 123
                });
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[SET] step id missing : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2005-10-22 03:01:50",
                    user_process_id: 3
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] step id empty : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:20:20",
                    user_process_id: 1,
                    step_id: null
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[SET] step not found : should not set a meeting in calendar table with a 404 status code", async () => {
                UserProcess.getById = jest.fn().mockReturnValue({ something: 'not null' });
                Step.getById = jest.fn().mockReturnValue(null);
                const response = await request(server).post("/calendar/set").send({
                    date: date,
                    user_process_id: 12,
                    step_id: 5345435
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Step not found.');
                expect(response.response).not.toBeNull();
            });
            test("[SET] should return 500 status code if an error occurs", async () => {
                try {
                    sinon.stub(UserProcess, 'getById').throws(new Error('db query failed'));
                    const response = await request(server).post("/calendar/set").send({
                        date: date,
                        user_process_id: 12,
                        step_id: 5345435
                    });

                    expect(response.statusCode).toBe(500);
                } catch(error) {
                    console.log(error);
                }
            });
            test("[GET ALL] token missing : should not get all meeting from calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/getAll").query({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] token empty : should not get all meeting from calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/getAll").query({
                    token: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] user not found : should not set a meeting in calendar table with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/calendar/getAll").query({
                    token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
                expect(response.response).not.toBeNull();
            });
            test("[GET ALL] process not found : should not set a meeting in calendar table with a 404 status code", async () => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.getAll = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/calendar/getAll").query({
                    token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[GET ALL] user step not found : should not set a meeting in calendar table with a 404 status code", async () => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.getAll = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue({ title: 'title' });
                UserStep.getAllAppoinment = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/calendar/getAll").query({
                    token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process, step or user step not found.');
                expect(response.response).not.toBeNull();
            });
            test("[GET ALL] process not found : should not set a meeting in calendar table with a 404 status code", async () => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.getAll = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/calendar/getAll").query({
                    token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process, step or user step not found.');
                expect(response.response).not.toBeNull();
            });
            test("[GET ALL] step not found : should not set a meeting in calendar table with a 404 status code", async () => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.getAll = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue({ title: 'title' });
                UserStep.getAllAppoinment = jest.fn().mockReturnValue([{ step_id: 1, appoinment: 1, user_process_id: 1 }]);
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/calendar/getAll").query({
                    token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process, step or user step not found.');
                expect(response.response).not.toBeNull();
            });
            test("[GET ALL] should return 500 status code if an error occurs", async () => {
                try {
                    sinon.stub(Users, 'findToken').throws(new Error('db query failed'));
                    const response = await request(server).get("/calendar/getAll").query({
                        token: "123"
                    });
                } catch(error) {
                    expect(response.statusCode).toBe(500);
                }
            });
            test("[DELETE] user process id missing : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/delete").query({
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE] user process id empty : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: "",
                    step_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE] step id missing : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: 2
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE] step id empty : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: "",
                    step_id: null
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE] user process id not existing : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: 534537,
                    step_id: 1
                });
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE] step id not existing : should not set a meeting in calendar table with a 400 status code", async () => {
                UserProcess.getById = jest.fn().mockReturnValue({ something: 'not null' });
                Step.getById = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: 1,
                    step_id: 5495
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] user process not found : should a 404 status code", async () => {
                UserProcess.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: 1,
                    step_id: 5495
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should return 500 status code if an error occurs", async () => {
                try {
                    sinon.stub(UserProcess, 'getById').throws(new Error('db query failed'));
                    const response = await request(server).get("/calendar/delete").query({
                        user_process_id: 1,
                        step_id: 5495
                    });
                } catch(error) {
                    expect(response.statusCode).toBe(500);
                }
            });
        });
    });
});
