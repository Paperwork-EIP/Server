const request = require("supertest");
const router = require("../../src/process/index");
const routerCalendar = require("../../src/process/calendar");
const { start, stop } = require("../../index");

describe("Calendar tests", () => {
    const port = 3009;
    let server;

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
                const register = await request(server).post("/user/register").send({
                    email: "blablabla@bla.com",
                    username: "blablabla",
                    password: "blablabla"
                });
                const login = await request(server).post("/user/login").send({
                    email: "blablabla@bla.com",
                    password: "blablabla"
                });
                const createProcess = await request(server).post("/process/add").send({
                    title: "Processsssssssssss",
                    description: "dhsdjsvvj",
                    source: "https://google.com",
                    delay: "2001-50-30"
                });
                const createUserProcess = await request(server).post("/userProcess/add").send({
                    process_title: "Processsssssssssss",
                    user_email: "blablabla@bla.com",
                    questions: [
                        [
                            1,
                            true
                        ]
                    ]
                });
                const createStep = await request(server).post("/step/add").send({
                    title: "VLS-TS",
                    type: "stepType",
                    description: "You must go to your appointement with your identity card and your residence permit (adress : 3 Pl. Adolphe Chérioux, 75015 Paris)",
                    question: "Do you have the french nationality or a resident permit ? 2",
                    source: "stepSource",
                    is_unique: false,
                    delay: "0030-00-00",
                    process_title: "Processsssssssssss"
                });
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11",
                    user_process_id: 1,
                    step_id: 1
                });
                const deleteStep = await request(server).get("/step/deleteall").query({
                    process_title: "Processsssssssssss"
                });
                const deleteUserProcess = await request(server).get("/userProcess/delete").query({
                    user_email: "blablabla@bla.com",
                    process_title: "Processsssssssssss"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "Processsssssssssss"
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: "blablabla@bla.com"
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
            test("[GET ALL] should get all meeting from calendar table with a 200 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: "blablabla@bla.com",
                    username: "blablabla",
                    password: "blablabla"
                });
                const login = await request(server).post("/user/login").send({
                    email: "blablabla@bla.com",
                    password: "blablabla"
                });
                const createProcess = await request(server).post("/process/add").send({
                    title: "Processsssssssssss",
                    description: "dhsdjsvvj",
                    source: "https://google.com",
                    delay: "2001-50-30"
                });
                const createUserProcess = await request(server).post("/userProcess/add").send({
                    process_title: "Processsssssssssss",
                    user_email: "blablabla@bla.com",
                    questions: [
                        [
                            1,
                            true
                        ],
                    ]
                });
                const createStep = await request(server).post("/step/add").send({
                    title: "VLS-TkS",
                    type: "stepType",
                    description: "You must go to your appointement with your identity card and your residence permit (adress : 3 Pl. Adolphe Chérioux, 75015 Paris)",
                    question: "Do you have the french nationality or a resident permit ? 2",
                    source: "stepSource",
                    is_unique: false,
                    delay: "0030-00-00",
                    process_title: "Processsssssssssss"
                });
                const response = await request(server).get("/calendar/getAll").query({
                    email: "blablabla@bla.com"
                });
                const deleteStep = await request(server).get("/step/deleteall").query({
                    process_title: "Processsssssssssss"
                });
                const deleteUserProcess = await request(server).get("/userProcess/delete").query({
                    user_email: "blablabla@bla.com",
                    process_title: "Processsssssssssss"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "Processsssssssssss"
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: "blablabla@bla.com"
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
                    date: "2005-10-22 03:01:50",
                    user_process_id: 3,
                    step_id: null
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[SET] user process id not existing : should not set a meeting in calendar table with a 400 status code", async () => {
                const response = await request(server).post("/calendar/set").send({
                    date: "2005-10-22 03:01:50",
                    user_process_id: 534537,
                    step_id: 1
                });
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[SET] step id not existing : should not set a meeting in calendar table with a 400 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: "blablabla@bla.com",
                    username: "blablabla",
                    password: "blablabla"
                });
                const login = await request(server).post("/user/login").send({
                    email: "blablabla@bla.com",
                    password: "blablabla"
                });
                const createProcess = await request(server).post("/process/add").send({
                    title: "Processsssssssssss",
                    description: "dhsdjsvvj",
                    source: "https://google.com",
                    delay: "2001-50-30"
                });
                const createUserProcess = await request(server).post("/userProcess/add").send({
                    process_title: "Processsssssssssss",
                    user_email: "blablabla@bla.com",
                    questions: [
                        [
                            1,
                            true
                        ]
                    ]
                });
                const createStep = await request(server).post("/step/add").send({
                    title: "VLS-TS",
                    type: "stepType",
                    description: "You must go to your appointement with your identity card and your residence permit (adress : 3 Pl. Adolphe Chérioux, 75015 Paris)",
                    question: "Do you have the french nationality or a resident permit ? 2",
                    source: "stepSource",
                    is_unique: false,
                    delay: "0030-00-00",
                    process_title: "Processsssssssssss"
                });
                const response = await request(server).post("/calendar/set").send({
                    date: "2011-11-11 20:20:20",
                    user_process_id: 1,
                    step_id: 19194
                });
                const deleteStep = await request(server).get("/step/deleteall").query({
                    process_title: "Processsssssssssss"
                });
                const deleteUserProcess = await request(server).get("/userProcess/delete").query({
                    user_email: "blablabla@bla.com",
                    process_title: "Processsssssssssss"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "Processsssssssssss"
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: "blablabla@bla.com"
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

                expect(response.statusCode).toBe(404);
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
            test("[GET ALL] email missing : should not get all meeting from calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/getAll").query({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] email empty : should not get all meeting from calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/getAll").query({
                    email: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] email not existing : should not get all meeting from calendar table with a 400 status code", async () => {
                const response = await request(server).get("/calendar/getAll").query({
                    email: "notexistingemail@google.com"
                });
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
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
                const register = await request(server).post("/user/register").send({
                    email: "blablabla@bla.com",
                    username: "blablabla",
                    password: "blablabla"
                });
                const login = await request(server).post("/user/login").send({
                    email: "blablabla@bla.com",
                    password: "blablabla"
                });
                const createProcess = await request(server).post("/process/add").send({
                    title: "Processsssssssssss",
                    description: "dhsdjsvvj",
                    source: "https://google.com",
                    delay: "2001-50-30"
                });
                const createUserProcess = await request(server).post("/userProcess/add").send({
                    process_title: "Processsssssssssss",
                    user_email: "blablabla@bla.com",
                    questions: [
                        [
                            1,
                            true
                        ]
                    ]
                });
                const createStep = await request(server).post("/step/add").send({
                    title: "VLS-TS",
                    type: "stepType",
                    description: "You must go to your appointement with your identity card and your residence permit (adress : 3 Pl. Adolphe Chérioux, 75015 Paris)",
                    question: "Do you have the french nationality or a resident permit ? 2",
                    source: "stepSource",
                    is_unique: false,
                    delay: "0030-00-00",
                    process_title: "Processsssssssssss"
                });
                const response = await request(server).get("/calendar/delete").query({
                    user_process_id: 1,
                    step_id: 5495
                });
                const deleteStep = await request(server).get("/step/deleteall").query({
                    process_title: "Processsssssssssss"
                });
                const deleteUserProcess = await request(server).get("/userProcess/delete").query({
                    user_email: "blablabla@bla.com",
                    process_title: "Processsssssssssss"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "Processsssssssssss"
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: "blablabla@bla.com"
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

                expect(response.statusCode).toBe(404);
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
        });
    });
});