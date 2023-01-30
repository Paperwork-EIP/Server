const request = require("supertest");
const rewire = require("rewire");
const sinon = require("sinon");
const router = require("../../src/process/index");
const routerUserProcess = require("../../src/process/userProcess");
const { start, stop } = require("../../index");
const Users = require("../../src/persistence/users");
const Step = require("../../src/persistence/step");
const Process = require("../../src/persistence/process");
const UserProcess = require("../../src/persistence/userProcess");
const UserStep = require("../../src/persistence/userStep");

describe("User process", () => {
    const port = 3006;
    let server;

    const user_email = "blablazbla@bla.com";
    const process_title = "Kebab";

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
        test("[index.js] should have a router component", async () => {
            expect(router).not.toBeNull();
        });
        test("[index.js] should have instanced the router component", async () => {
            expect(router).toBeDefined();
        });
        test("[process.js] should have a router component", async () => {
            expect(routerUserProcess).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", async () => {
            expect(routerUserProcess).toBeDefined();
        });
        test("[GetPercentage()] should be called", async () => {
            const id = 5435978;
            const moduleUserProcess = rewire("../../src/process/userProcess");
            const getPercentage = moduleUserProcess.__get__("getPercentage");

            expect(getPercentage(id)).not.toBeNull();
        });
    });

    describe("[INTEGRATION TESTS", () => {
        describe("[VALID USER PROCESS TESTS]", () => {
            test("[ADD] should add a user process with a 200 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.create = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });

                const response = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_email: user_email,
                    questions: [
                        [
                            1,
                            true
                        ],
                    ]
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] should update user process with receive data with a 200 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.update = jest.fn().mockReturnValue({ something: 'something' });

                const response = await request(server).post("/userProcess/update").send({
                    user_email: user_email,
                    process_title: process_title,
                    step_id: 1,
                    is_done: true
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should delete user process with a 200 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.delete = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });
                const response = await request(server).get("/userProcess/delete").query({
                    user_email: user_email,
                    process_title: process_title
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID USER PROCESS TESTS]", () => {
            test("[ADD] user email missing : should not add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    process_title: "Test",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] user email empty : should not add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "",
                    process_title: "Test",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process title missing : should not add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process title empty : should not add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    process_title: "",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] questions missing : should not add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] questions empty : should not add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    process_title: "Test",
                    questions: null
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] user not found : should not add a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "hhhhhhhhhhhhhhhhhhhhhhhhhhhtiiiiiiiiiiiiiitllllleeeeee",
                    user_email: "l",
                    questions: [
                        [
                            1,
                            true
                        ],
                    ]
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process not found : should not add a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "t",
                    user_email: "swedfgtyhujikujyhnbgfvdce",
                    questions: [
                        [
                            1,
                            true
                        ],
                    ]
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[ADD] user process not found : should not add a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue(null);
                UserProcess.create = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "t",
                    user_email: "swedfgtyhujikujyhnbgfvdce",
                    questions: [
                        [
                            1,
                            true
                        ],
                    ]
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('User process created!');
                expect(response.response).not.toBeNull();
            });
            test("[ADD] step not found : should not add a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ something: 'not null' });
                Process.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserProcess.get = jest.fn().mockReturnValue({ something: 'not null' });
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "hhhhhhhhhhhhhhhhhhhhhhhhhhhtiiiiiiiiiiiiiitllllleeeeee",
                    user_email: "cefevced   fefefe",
                    questions: [
                        [
                            1829394938,
                            true
                        ],
                    ]
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should throw an error if error occurs", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue(null);
                sinon.stub(UserProcess, 'create').throws(new Error('db query failed'));

                const response = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_email: user_email,
                    questions: [
                        [
                            1,
                            true
                        ],
                    ]
                });

                expect(response.statusCode).toBe(500);
            });
            test("[UPDATE] user email missing : should not update a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/update").send({
                    process_title: "Test",
                    step_id: 1,
                    is_done: true
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] user email empty : should not update a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/update").send({
                    user_email: "",
                    process_title: "Test",
                    step_id: 1,
                    is_done: true
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] process title missing : should not update a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/update").send({
                    user_email: "test@test.com",
                    step_id: 1,
                    is_done: true
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] process title empty : should not update a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/update").send({
                    user_email: "test@test.com",
                    process_title: "",
                    step_id: 1,
                    is_done: true
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] step id missing : should not update a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/update").send({
                    user_email: "test@test.com",
                    process_title: "Test",
                    is_done: true
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] step id empty : should not update a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/update").send({
                    user_email: "test@test.com",
                    process_title: "Test",
                    step_id: null,
                    is_done: true
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] user not found : should not update a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: "hhhhhhhhhhhhhhhhhhhhhhhhhhhtiiiiiiiiiiiiiitllllleeeeee",
                    user_email: "h",
                    is_done: true,
                    step_id: 1
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] process not found : should not update a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: "t",
                    user_email: "qqqqqqqq",
                    is_done: true,
                    step_id: 1
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] userProcess not found : should not update a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue({ something: 'not null' });
                UserProcess.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: "hhhhhhhhhhhhhhhhhhhhhhhhhhhtiiiiiiiiiiiiiitllllleeeeee",
                    user_email: "wwwwwwww",
                    is_done: true,
                    step_id: 1
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] step not found : should not update a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue({ something: 'not null' });
                UserProcess.get = jest.fn().mockReturnValue({ something: 'not null' });
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: 1,
                    user_email: "emaimvaafg",
                    is_done: true,
                    step_id: 8734
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Step not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] throw an error if error occurs", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                sinon.stub(UserStep, 'update').throws(new Error('db query failed'));

                const response = await request(server).post("/userProcess/update").send({
                    user_email: user_email,
                    process_title: process_title,
                    step_id: 1,
                    is_done: true
                });

                expect(response.statusCode).toBe(500);
            });
            test("[DELETE] user email empty : should not delete a user process with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_email: "",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] user email missing : should not delete a user process with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/delete").query({
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] user email not found : should not delete a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/userProcess/delete").query({
                    user_email: "asdasda",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
            });
            test("[DELETE] process title empty : should not delete a user process with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_email: "test@test.com",
                    process_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] process title missing : should not delete a user process with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_email: "test@test.com"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] process not found : should not delete a user process with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/userProcess/delete").query({
                    user_email: "uuuuuudnelfeklfmlemfklmel",
                    process_title: "t",
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] user not found : should not delete a user process with a 404 status code", async () => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_email: "234",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(404);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should throw an error if error occurs", async () => {
                Users.find = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });
                sinon.stub(UserProcess, 'delete').throws(new Error('db query failed'));

                const response = await request(server).get("/userProcess/delete").query({
                    user_email: user_email,
                    process_title: process_title
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            });
            test("[GET USER STEPS] email empty : should not get a user step with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_email: "",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] email missing : should not get a user step with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] email missing : should not get a user step with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] process title empty : should not get a user step with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_email: "test@test.com",
                    process_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] process title missing : should not get a user step with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_email: "test@test.com"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] user not found : should not get a user step with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_email: " ",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(404);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] process not found : should not get a user step with a 404 status code", async () => {
                Users.find = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_email: "ghjkdhicudhsnklvnsdvnds",
                    process_title: "hahaha"
                });

                expect(response.statusCode).toBe(404);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEP BY ID] user process id empty : should not get a user step with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: null
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEP BY ID] user process id missing : should not get a user step with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserStepsById").query({});

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS BY ID] user process not found : should not get a user step with a 404 status code", async () => {
                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 4567865,
                });

                expect(response.statusCode).toBe(404);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER PROCESSES] email empty : should not get a user processes with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_email: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER PROCESSES] email missing : should not get a user processes with a 400 status code", async () => {
                const response = await request(server).get("/userProcess/getUserProcesses").query({});

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER PROCESSES] user not found : should not get a user processes with a 404 status code", async () => {
                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_email: " "
                });

                expect(response.statusCode).toBe(404);
                expect(response.response).not.toBeNull();
            });
        });
    });
});