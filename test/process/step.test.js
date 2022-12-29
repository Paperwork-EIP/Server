const request = require("supertest");
const router = require("../../src/process/index");
const { start, stop } = require("../../index");

describe("Steps tests", () => {
    const port = 3005;
    let server;

    beforeAll(() => {
        server = start(port);
    });

    afterAll(() => {
        stop();
    });

    describe("[UNIT TESTS]", () => {
        test("should have a router component", () => {
            expect(router).not.toBeNull();
        });
        test("should have instanced the router component", () => {
            expect(router).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID STEP TESTS]", () => {
            test("[ADD] should add a step in the database with a 200 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "TestStep",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[DELETE] should delete all steps with a 200 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const createStep_1 = await request(server).post("/step/add").send({
                    title: "TestStep1",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const createStep_2 = await request(server).post("/step/add").send({
                    title: "TestStep2",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const response = await request(server).get("/step/deleteall").query({
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(createStep_1.statusCode).toBe(200);
                expect(createStep_1.message).not.toBeNull();

                expect(createStep_2.statusCode).toBe(200);
                expect(createStep_2.message).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
        });
        describe("[INVALID STEP TESTS]", () => {
            test("[ADD] title missing : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] title empty : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] type missing : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] type empty : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] description missing : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] description empty : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] question missing : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] question empty : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] process title missing : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] process title empty : should not create a step with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: ""
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] process title not found : should not create a step with a 404 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "Unexpcted procss"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            /*
            test("[ADD] unexpected character -> title not a string : should not create a step with a 500 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "친톡",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: true,
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "친톡"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "친톡"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(500);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] unexpected character -> type not a string : should not create a step with a 500 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "친톡",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: true,
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "친톡"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "친톡"
                });

                expect(createProcess.statusCode).toBe(400);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(500);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(400);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] unexpected character -> description not a string : should not create a step with a 500 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "친톡",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: 2,
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: 1
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "친톡"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(500);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] unexpected character -> question not a string : should not create a step with a 500 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "친톡",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: 5,
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: 1
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "친톡"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(500);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] unexpected character -> source not a string : should not create a step with a 500 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "친톡",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: 22,
                    is_unique: true,
                    delay: null,
                    process_title: "친톡"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "친톡"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(500);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] unexpected character -> is_unique not a boolean : should not create a step with a 500 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "친톡",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: "true",
                    delay: null,
                    process_title: "친톡"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "친톡"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(500);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[ADD] unexpected character -> process_title not a string : should not create a step with a 500 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "친톡",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: false
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "친톡"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            */
            test("[DELETE] process title missing : should delete all steps with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const createStep_1 = await request(server).post("/step/add").send({
                    title: "TestStep1",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const createStep_2 = await request(server).post("/step/add").send({
                    title: "TestStep2",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const response = await request(server).get("/step/deleteall").query({});
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(createStep_1.statusCode).toBe(200);
                expect(createStep_1.message).not.toBeNull();

                expect(createStep_2.statusCode).toBe(200);
                expect(createStep_2.message).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });            
            test("[DELETE] process title empty : should not delete all steps with a 400 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "vhffdguergrhgoor",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                const createStep_1 = await request(server).post("/step/add").send({
                    title: "TestStep1",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const createStep_2 = await request(server).post("/step/add").send({
                    title: "TestStep2",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoor"
                });
                const response = await request(server).get("/step/deleteall").query({
                    process_title: ""
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoor"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(createStep_1.statusCode).toBe(200);
                expect(createStep_1.message).not.toBeNull();

                expect(createStep_2.statusCode).toBe(200);
                expect(createStep_2.message).not.toBeNull();

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
        });
    });
});