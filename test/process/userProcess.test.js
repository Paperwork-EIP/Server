const request = require("supertest");
const router = require("../../src/process/index");
const routerUserProcess = require("../../src/process/userProcess");
const { start, stop } = require("../../index");

describe("User process", () => {
    const port = 3006;
    let server;
    
    const user_email = "blablazbla@bla.com";
    const password = "blablabla";
    const username = "blablkabla";
    const date = "2011-11-11 20:20:20";
    const process_title = "Kebab";

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
            expect(routerUserProcess).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", () => {
            expect(routerUserProcess).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS", () => {
        describe("[VALID USER PROCESS TESTS]", () => {
            test("[ADD] should add a user process with a 200 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: user_email,
                    username: username,
                    password: password
                });
                const login = await request(server).post("/user/login").send({
                    email: user_email,
                    password: password
                });
                const createProcess = await request(server).post("/process/add").send({
                    title: process_title,
                    description: "dhsdjsvvj",
                    source: "https://google.com",
                    delay: date
                });
                const createStep = await request(server).post("/step/add").send({
                    title: "VLS-TkS",
                    type: "stepType",
                    description: "You must go to your appointement with your identity card and your residence permit (adress : 3 Pl. Adolphe Chérioux, 75015 Paris)",
                    question: "Do you have the french nationality or a resident permit ? 2",
                    source: "stepSource",
                    is_unique: false,
                    delay: date,
                    process_title: process_title
                });
                const createStepResultParsed = JSON.parse(createStep.text);
                const step_id = createStepResultParsed.response.id;
                const response = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_email: user_email,
                    questions: [
                        [
                            step_id,
                            true
                        ],
                    ]
                });
                const deleteStep = await request(server).get("/step/deleteall").query({
                    process_title: process_title
                });
                const deleteUserProcess = await request(server).get("/userProcess/delete").query({
                    user_email: user_email,
                    process_title: process_title
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: process_title
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: user_email
                });

                expect(register.statusCode).toBe(200);
                expect(register.message).not.toBeNull();

                expect(login.statusCode).toBe(200);
                expect(login.message).not.toBeNull();

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(createStep.statusCode).toBe(200);
                expect(createStep.message).not.toBeNull();
                expect(createStep.response).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();

                expect(deleteStep.statusCode).toBe(200);
                expect(deleteStep.message).not.toBeNull();

                expect(deleteUserProcess.statusCode).toBe(200);
                expect(deleteUserProcess.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
            test("[UPDATE] should update user process with receive data with a 200 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: user_email,
                    username: username,
                    password: password
                });
                const login = await request(server).post("/user/login").send({
                    email: user_email,
                    password: password
                });
                const createProcess = await request(server).post("/process/add").send({
                    title: process_title,
                    description: "dhsdjsvvj",
                    source: "https://google.com",
                    delay: date
                });
                const createStep = await request(server).post("/step/add").send({
                    title: "VLS-TkS",
                    type: "stepType",
                    description: "You must go to your appointement with your identity card and your residence permit (adress : 3 Pl. Adolphe Chérioux, 75015 Paris)",
                    question: "Do you have the french nationality or a resident permit ? 2",
                    source: "stepSource",
                    is_unique: false,
                    delay: date,
                    process_title: process_title
                });
                const createStepResultParsed = JSON.parse(createStep.text);
                const step_id = createStepResultParsed.response.id;
                const createUserProcess = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_email: user_email,
                    questions: [
                        [
                            step_id,
                            false
                        ]
                    ]
                });
                const response = await request(server).post("/userProcess/update").send({
                    user_email: user_email,
                    process_title: process_title,
                    step_id: step_id,
                    is_done: true
                });
                const deleteStep = await request(server).get("/step/deleteall").query({
                    process_title: process_title
                });
                const deleteUserProcess = await request(server).get("/userProcess/delete").query({
                    user_email: user_email,
                    process_title: process_title
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: process_title
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: user_email
                });

                expect(register.statusCode).toBe(200);
                expect(register.message).not.toBeNull();

                expect(login.statusCode).toBe(200);
                expect(login.message).not.toBeNull();

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(createStep.statusCode).toBe(200);
                expect(createStep.message).not.toBeNull();
                expect(createStep.response).not.toBeNull();

                expect(createUserProcess.statusCode).toBe(200);
                expect(createUserProcess.message).not.toBeNull();
                expect(createUserProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();

                expect(deleteStep.statusCode).toBe(200);
                expect(deleteStep.message).not.toBeNull();

                expect(deleteUserProcess.statusCode).toBe(200);
                expect(deleteUserProcess.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
            test("[DELETE] should delete user process with a 200 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: user_email,
                    username: username,
                    password: password
                });
                const login = await request(server).post("/user/login").send({
                    email: user_email,
                    password: password
                });
                const createProcess = await request(server).post("/process/add").send({
                    title: process_title,
                    description: "dhsdjsvvj",
                    source: "https://google.com",
                    delay: date
                });
                const createStep = await request(server).post("/step/add").send({
                    title: "VLS-TS",
                    type: "stepType",
                    description: "You must go to your appointement with your identity card and your residence permit (adress : 3 Pl. Adolphe Chérioux, 75015 Paris)",
                    question: "Do you have the french nationality or a resident permit ? 2",
                    source: "stepSource",
                    is_unique: false,
                    delay: date,
                    process_title: process_title
                });
                const createStepResultParsed = JSON.parse(createStep.text);
                const step_id = createStepResultParsed.response.id;
                const createUserProcess = await request(server).post("/userProcess/add").send({
                    process_title: process_title,
                    user_email: user_email,
                    questions: [
                        [
                            step_id,
                            true
                        ]
                    ]
                });
                const deleteStep = await request(server).get("/step/deleteall").query({
                    process_title: process_title
                });
                const response = await request(server).get("/userProcess/delete").query({
                    user_email: user_email,
                    process_title: process_title
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: process_title
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: user_email
                });

                expect(register.statusCode).toBe(200);
                expect(register.message).not.toBeNull();

                expect(login.statusCode).toBe(200);
                expect(login.message).not.toBeNull();

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(createUserProcess.statusCode).toBe(200);
                expect(createUserProcess.message).not.toBeNull();
                expect(createUserProcess.response).not.toBeNull();

                expect(createStep.statusCode).toBe(200);
                expect(createStep.message).not.toBeNull();
                expect(createStep.response).not.toBeNull();

                expect(deleteStep.statusCode).toBe(200);
                expect(deleteStep.message).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
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
        });
    });
});