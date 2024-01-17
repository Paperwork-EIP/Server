const request = require("supertest");
const sinon = require("sinon");
const router = require("../../../src/routes/router");
const routerUserProcess = require("../../../src/routes/userProcess/userProcess");
const { start, stop } = require("../../../index");
const Users = require("../../../src/persistence/users/users");
const Step = require("../../../src/persistence/process/step");
const Process = require("../../../src/persistence/process/process");
const UserProcess = require("../../../src/persistence/userProcess/userProcess");
const UserStep = require("../../../src/persistence/userProcess/userStep");
const UserUnderStep = require("../../../src/persistence/userProcess/userUnderStep");
const visa = require("../../../src/data/Visa.json");
const fs = require('fs');

describe("User process", () => {
    const port = 3006;
    let server;

    const user_token = "blablazbla@bla.com";
    const process_title = "Kebab";

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
    });

    beforeAll(async() => {
        server = await start(port);
    });

    afterAll(() => {
        stop();
    });

    describe("[UNIT TESTS]", () => {
        test("[index.js] should have a router component", async() => {
            expect(router).not.toBeNull();
        });
        test("[index.js] should have instanced the router component", async() => {
            expect(router).toBeDefined();
        });
        test("[process.js] should have a router component", async() => {
            expect(routerUserProcess).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", async() => {
            expect(routerUserProcess).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS", () => {
        describe("[VALID USER PROCESS TESTS]", () => {
            test("[ADD] should add a user process with a 200 status code with understep not done", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue(null);
                UserProcess.getByTitleAndUserID = jest.fn().mockReturnValue(null);
                UserProcess.create = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });
                UserUnderStep.add = jest.fn().mockReturnValue({ something: 'something' });
                UserUnderStep.getAllNotDoneByStepId = jest.fn().mockReturnValue([{ id: 1 }]);
                UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([{ id: 1 }]);
                UserStep.getNotDone = jest.fn().mockReturnValue([{ something: 'something' }]);
                UserProcess.update = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_token: user_token,
                    questions: [{
                        step_id: 1,
                        response: false,
                        underQuestions: [{
                            id: 1,
                            response: false
                        }]
                    }, ]
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response._body.message).toEqual('User process created!');
            });
            test("[ADD] should add a user process with a 200 status code with understep done", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue(null);
                UserProcess.getByTitleAndUserID = jest.fn().mockReturnValue(null);
                UserProcess.create = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });
                UserUnderStep.add = jest.fn().mockReturnValue({ something: 'something' });
                UserUnderStep.getAllNotDoneByStepId = jest.fn().mockReturnValue([]);
                UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([{ id: 1 }]);
                UserStep.getNotDone = jest.fn().mockReturnValue([{ something: 'something' }]);
                UserProcess.update = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_token: user_token,
                    questions: [{
                        step_id: 1,
                        response: false,
                        underQuestions: [{
                            id: 1,
                            response: false
                        }]
                    }, ]
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response._body.message).toEqual('User process created!');
            });
            test("[ADD] should add a user process with a 200 status code (all tasks done)", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                UserStep.deleteAll = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.create = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });
                UserStep.getNotDone = jest.fn().mockReturnValue([]);
                UserProcess.update = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_token: user_token,
                    questions: [{
                        step_id: 1,
                        response: true
                    }, ]
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response._body.message).toEqual('User process created!');
            });
            test("[UPDATE] should update user process with receive data with a 200 status code, with under step bot done", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserUnderStep.update = jest.fn().mockReturnValue({ something: 'something' });
                UserUnderStep.getAllNotDoneByStepId = jest.fn().mockReturnValue([{ id: 1 }]);
                UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([{ id: 1 }]);
                UserStep.update = jest.fn().mockReturnValue({ something: 'something' });
                UserStep.getNotDone = jest.fn().mockReturnValue([{ something: 'something' }]);
                UserProcess.update = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/userProcess/update").send({
                    user_token: user_token,
                    process_title: process_title,
                    questions: [{
                        step_id: 1,
                        response: true,
                        underQuestions: [{
                            id: 1,
                            response: true
                        }]
                    }]
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('User process updated!');
                expect(response._body.response).toEqual([{ something: 'something' }]);
            });
            test("[UPDATE] should update user process with receive data with a 200 status code, with under step all done", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserUnderStep.update = jest.fn().mockReturnValue({ something: 'something' });
                UserUnderStep.getAllNotDoneByStepId = jest.fn().mockReturnValue([]);
                UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([{ id: 1 }]);
                UserStep.update = jest.fn().mockReturnValue({ something: 'something' });
                UserStep.getNotDone = jest.fn().mockReturnValue([{ something: 'something' }]);
                UserProcess.update = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/userProcess/update").send({
                    user_token: user_token,
                    process_title: process_title,
                    questions: [{
                        step_id: 1,
                        response: true,
                        underQuestions: [{
                            id: 1,
                            response: true
                        }]
                    }]
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('User process updated!');
                expect(response._body.response).toEqual([{ something: 'something' }]);
            });
            test("[UPDATE] should update user process with receive data with a 200 status code(getNotDone empty)", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserUnderStep.getAllNotDoneByStepId = jest.fn().mockReturnValue([]);
                UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([]);
                UserStep.update = jest.fn().mockReturnValue({ something: 'something' });
                UserStep.getNotDone = jest.fn().mockReturnValue([]);
                UserProcess.update = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/userProcess/update").send({
                    user_token: user_token,
                    process_title: process_title,
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('User process updated!');
                expect(response._body.response).toEqual([{ something: 'something' }]);
            });
            test("[DELETE] should delete user process with a 200 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                UserStep.deleteAll = jest.fn().mockReturnValue({ something: 'something' });
                UserProcess.delete = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                UserStep.create = jest.fn().mockReturnValue({ something: 'something' });

                const response = await request(server).get("/userProcess/delete").query({
                    user_token: user_token,
                    process_title: process_title
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('User process deleted!');
            });
            test("[GET USER STEPS] should return user steps with a 200 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'french' });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                UserStep.getAll = jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
                UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([{ id: 1, step_id: 1 }]);
                UserStep.getNotDone = jest.fn().mockReturnValue([{ id: 1 }]);

                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: user_token,
                    process_title: process_title
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.pourcentage).toEqual(67);
                expect(response._body.message).toEqual('User process steps');
            });
            test("[GET USER STEPS BY ID] should return user steps with a 200 status code", async() => {
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                Users.getById = jest.fn().mockReturnValue({ id: 1, language: 'french' });
                UserStep.getAll = jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
                UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([{ id: 1, step_id: 1 }]);
                UserStep.getNotDone = jest.fn().mockReturnValue([{ id: 1 }]);

                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 1,
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.pourcentage).toEqual(67);
                expect(response._body.message).toEqual('User process steps');
            });
            test("[GET USER PROCESSES] should return user steps with a 200 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'french' });
                UserProcess.getAll = jest.fn().mockReturnValue([{ id: 1, process_id: 1 }]);
                Process.getById = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                UserStep.getAll = jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
                UserStep.getNotDone = jest.fn().mockReturnValue([{ id: 1 }]);
                // UserUnderStep.getAllByStepId = jest.fn().mockReturnValue([{ id: 1, step_id: 1 }])

                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_token: user_token
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.response).toEqual([{ pourcentage: 67, userProcess: { id: 1, process_id: 1, title: visa.french.title, description: visa.french.description, source: visa.french.source, stocked_title: 'Visa' } }]);
                expect(response._body.message).toEqual('User processes');
            });
        });
        describe("[INVALID USER PROCESS TESTS]", () => {
            test("[ADD] user email missing : should not add a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/add").send({
                    process_title: "Test",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] user email empty : should not add a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/add").send({
                    user_token: "",
                    process_title: "Test",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process title missing : should not add a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/add").send({
                    user_token: "test@test.com",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process title empty : should not add a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/add").send({
                    user_token: "test@test.com",
                    process_title: "",
                    questions: []
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] questions missing : should not add a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/add").send({
                    user_token: "test@test.com",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] questions empty : should not add a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/add").send({
                    user_token: "test@test.com",
                    process_title: "Test",
                    questions: null
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] user not found : should not add a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "hhhhhhhhhhhhhhhhhhhhhhhhhhhtiiiiiiiiiiiiiitllllleeeeee",
                    user_token: "l",
                    questions: [{
                        step_id: 1,
                        response: true
                    }, ]
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process not found : should not add a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "t",
                    user_token: "swedfgtyhujikujyhnbgfvdce",
                    questions: [{
                        step_id: 1,
                        response: true
                    }, ]
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[ADD] step not found : should not add a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue({ something: 'not null' });
                UserProcess.get = jest.fn().mockReturnValue(null);
                UserProcess.create = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "test",
                    user_token: "emaimvaafg",
                    questions: [{
                        step_id: 8734,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Step not found.');
                expect(response.response).not.toBeNull();
            });
            test("[ADD] User process already exist : should not add a user process with a 409 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ something: 'not null' });
                UserProcess.getByTitleAndUserID = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/userProcess/add").send({
                    process_title: "test",
                    user_token: "emaimvaafg",
                    questions: [{
                        step_id: 8734,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(409);
                expect(response._body.message).toEqual('User process already exist.');
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should throw an error if error occurs", async() => {
                let response;

                try {
                    Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                    Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                    UserProcess.get = jest.fn().mockReturnValue(null);
                    sinon.stub(UserProcess, 'create').throws(new Error('db query failed'));

                    response = await request(server).post("/userProcess/add").send({
                        process_title: process_title,
                        user_token: user_token,
                        questions: [{
                            step_id: 1829394938,
                            response: true
                        }, ]
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                    expect(response._body.message).toEqual('System error.');
                }
            });
            test("[UPDATE] user email missing : should not update a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/update").send({
                    process_title: "Test",
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] user email empty : should not update a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/update").send({
                    user_token: "",
                    process_title: "Test",
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] process title missing : should not update a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/update").send({
                    user_token: "test@test.com",
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] process title empty : should not update a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/update").send({
                    user_token: "test@test.com",
                    process_title: "",
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] step empty : should not update a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/update").send({
                    user_token: "test@test.com",
                    process_title: "Test",
                    questions: null
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] step missing : should not update a user process with a 400 status code", async() => {
                const response = await request(server).post("/userProcess/update").send({
                    user_token: "test@test.com",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] user not found : should not update a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: "hhhhhhhhhhhhhhhhhhhhhhhhhhhtiiiiiiiiiiiiiitllllleeeeee",
                    user_token: "h",
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] process not found : should not update a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: "t",
                    user_token: "qqqqqqqq",
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] userProcess not found : should not update a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue({ something: 'not null' });
                UserProcess.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: "hhhhhhhhhhhhhhhhhhhhhhhhhhhtiiiiiiiiiiiiiitllllleeeeee",
                    user_token: "wwwwwwww",
                    questions: [{
                        step_id: 1,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] step not found : should not update a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ something: 'not null' });
                Process.get = jest.fn().mockReturnValue({ something: 'not null' });
                UserProcess.get = jest.fn().mockReturnValue({ something: 'not null' });
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/userProcess/update").send({
                    process_title: 1,
                    user_token: "emaimvaafg",
                    questions: [{
                        step_id: 8734,
                        response: true
                    }]
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Step not found.');
                expect(response.response).not.toBeNull();
            });
            test("[UPDATE] throw an error if error occurs", async() => {
                let response;

                try {
                    Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                    Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                    UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                    Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                    sinon.stub(UserStep, 'update').throws(new Error('db query failed'));

                    response = await request(server).post("/userProcess/update").send({
                        user_token: user_token,
                        process_title: process_title,
                        questions: [{
                            step_id: 1,
                            response: true
                        }]
                    });
                } catch { error } {
                    expect(response.statusCode).toBe(500);
                }
            });
            test("[DELETE] user email empty : should not delete a user process with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_token: "",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] user email missing : should not delete a user process with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/delete").query({
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] user email not found : should not delete a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/userProcess/delete").query({
                    user_token: "asdasda",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
            });
            test("[DELETE] process title empty : should not delete a user process with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_token: "test@test.com",
                    process_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] process title missing : should not delete a user process with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_token: "test@test.com"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] process not found : should not delete a user process with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                Process.get = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/userProcess/delete").query({
                    user_token: "uuuuuudnelfeklfmlemfklmel",
                    process_title: "t",
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] user not found : should not delete a user process with a 404 status code", async() => {
                const response = await request(server).get("/userProcess/delete").query({
                    user_token: "234",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(404);
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should throw an error if error occurs", async() => {
                let response;

                try {
                    Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                    Process.get = jest.fn().mockReturnValue({ id: 1, title: 'truc' });
                    UserProcess.get = jest.fn().mockReturnValue({ id: 1 });
                    Step.getById = jest.fn().mockReturnValue({ something: 'not null' });
                    UserStep.create = jest.fn().mockReturnValue({ something: 'something' });
                    sinon.stub(UserProcess, 'delete').throws(new Error('db query failed'));

                    response = await request(server).get("/userProcess/delete").query({
                        user_token: user_token,
                        process_title: process_title
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                    expect(response._body.message).toEqual('System error.');
                }
            });
            test("[DELETE] user not found : should not delete a user process with a 404 status code", async() => {
                const response = await request(server).post("/userProcess/delete").send({
                    user_token: " ",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(404);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] email empty : should not get a user step with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] email missing : should not get a user step with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] user not found : should not get a user step with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "234",
                    process_title: "Test"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
            });
            test("[GET USER STEPS] process title empty : should not get a user step with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "test@test.com",
                    process_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] process title missing : should not get a user step with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "test@test.com"
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS] process not found : should not get a user step with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ somthing: 'not null' });
                Process.get = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "ghjkdhicudhsnklvnsdvnds",
                    process_title: "hahaha"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
            });
            test("[GET USER STEPS] user process not found : should not get a user step with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                UserProcess.get = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "ghjkdhicudhsnklvnsdvnds",
                    process_title: "hahaha"
                });
                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User process not found.');
            });
            test("[GET USER STEPS] data not found : should not get a user step with a 404 status code(file empty)", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                jest.mock('../../../src/data/Visa.json', () => null);
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "ghjkdhicudhsnklvnsdvnds",
                    process_title: "hahaha"
                });
                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET USER STEPS] data not found : should not get a user step with a 404 status code(file don't exist)", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'Visacdscsd' });
                const response = await request(server).get("/userProcess/getUserSteps").query({
                    user_token: "ghjkdhicudhsnklvnsdvnds",
                    process_title: "hahaha"
                });
                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET USER STEPS]should throw an error if error occurs", async() => {
                let response;

                try {
                    Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                    sinon.stub(Process, 'get').throws(new Error('db query failed'));
                    response = await request(server).get("/userProcess/getUserSteps").query({
                        user_token: "ghjkdhicudhsnklvnsdvnds",
                        process_title: "hahaha"
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }
            });
            test("[GET USER STEP BY ID] user process id empty : should not get a user step with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: null
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEP BY ID] user process id missing : should not get a user step with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserStepsById").query({});

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER STEPS BY ID] user process not found : should not get a user step with a 404 status code", async() => {
                UserProcess.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 4567865,
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User process not found.');
            });
            test("[GET USER STEPS BY ID] user not found : should not get a user step with a 404 status code", async() => {
                Users.getById = jest.fn().mockReturnValue(null);
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 4567865,
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
            });
            test("[GET USER STEPS BY ID] user step not found : should not get a user step with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                UserStep.getAll = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 4567865,
                });

                expect(response.statusCode).toBe(404);
            });
            test("[GET USER STEPS BY ID] data not found : should not get a user step with a 404 status code (file empty)", async() => {
                Users.getById = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                jest.mock('../../../src/data/Visa.json', () => null);
                UserStep.getAll = jest.fn().mockReturnValue([{ id: 1 }]);

                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 4567865,
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET USER STEPS BY ID] data not found : should not get a user step with a 404 status code (file don't exist)", async() => {
                Users.getById = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue({ id: 1, title: 'Visagggg' });
                UserStep.getAll = jest.fn().mockReturnValue([{ id: 1 }]);

                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 4567865,
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET USER STEPS BY ID] Process not found : should not get a user step with a 404 status code", async() => {
                Users.getById = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                UserProcess.getById = jest.fn().mockReturnValue({ id: 1 });
                Process.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/userProcess/getUserStepsById").query({
                    user_process_id: 4567865,
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
            });
            test("[GET USER STEPS BY ID]  should throw an error if error occurs", async() => {
                let response;

                try {
                    sinon.stub(UserProcess, 'getById').throws(new Error('db query failed'));

                    response = await request(server).get("/userProcess/getUserStepsById").query({
                        user_process_id: 4567865,
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }
            });
            test("[GET USER PROCESSES] email empty : should not get a user processes with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_token: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER PROCESSES] email missing : should not get a user processes with a 400 status code", async() => {
                const response = await request(server).get("/userProcess/getUserProcesses").query({});

                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[GET USER PROCESSES] user not found : should not get a user processes with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
            });
            test("[GET USER PROCESSES] Process not found : should not get a user processes with a 404 status code", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                UserProcess.getAll = jest.fn().mockReturnValue([{ id: 1 }]);
                Process.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
            });
            test("[GET USER PROCESSES] Data not found : should not get a user processes with a 404 status code(file empty)", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                UserProcess.getAll = jest.fn().mockReturnValue([{ id: 1 }]);
                Process.getById = jest.fn().mockReturnValue({ title: 'Visa' });
                jest.mock('../../../src/data/Visa.json', () => null);

                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET USER PROCESSES] Data not found : should not get a user processes with a 404 status code(file don't exist)", async() => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1, language: 'english' });
                UserProcess.getAll = jest.fn().mockReturnValue([{ id: 1 }]);
                Process.getById = jest.fn().mockReturnValue({ title: 'Visxsxsa' });

                const response = await request(server).get("/userProcess/getUserProcesses").query({
                    user_token: "123"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET USER PROCESSES] should throw an error if error occurs", async() => {
                let response;

                try {
                    sinon.stub(Users, 'findToken').throws(new Error('db query failed'));

                    response = await request(server).get("/userProcess/getUserProcesses").query({
                        user_token: "123"
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }
            });
        });
    });
});