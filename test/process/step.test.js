const request = require("supertest");
const router = require("../../src/process/index");
const { start, stop } = require("../../index");

describe("Steps tests", () => {
    const port = 3005;
    let server;

    beforeAll(async () => {
        server = start(port);
    });

    afterAll(async () => {
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
                    title: "vhffdguergrhgoorgggggg",
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
                    process_title: "vhffdguergrhgoorgggggg"
                });
                const createStep_2 = await request(server).post("/step/add").send({
                    title: "TestStep2",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoorgggggg"
                });
                const response = await request(server).get("/step/deleteall").query({
                    process_title: "vhffdguergrhgoorgggggg"
                });
                const deleteProcess = await request(server).get("/process/delete").query({
                    title: "vhffdguergrhgoorgggggg"
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
                const response = await request(server).post("/step/add").send({
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoorfghjkkjhgf"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] title empty : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoorgdfsdadfgdsfead"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] type missing : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgoorbguyjhbjgyuh"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] type empty : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "vhffdguergrhgooecnsbfsdhjbcvwecjwer"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] description missing : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "nbgvcfdfghjkhgfdcfgbjhbedccbedjcbjk"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] description empty : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "fbgydhdjcmdnebvdnhcwcndlc"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] question missing : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "gjreuivnhuifdnvuwnuicdbnsbcbacebjrvns"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] question empty : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null,
                    process_title: "cbgdscvghdsjkcfkvnjkdfbjhacbhasj"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] process title missing : should not create a step with a 400 status code", async () => {
                const response = await request(server).post("/step/add").send({
                    title: "Test",
                    type: "TestType",
                    description: "This is a test",
                    question: "Test",
                    source: "https://google.com",
                    is_unique: true,
                    delay: null
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] process title empty : should not create a step with a 400 status code", async () => {
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

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] process title not found : should not create a step with a 404 status code", async () => {
                const createProcess = await request(server).post("/process/add").send({
                    title: "bdahajksdvjlfjletjhrgjhkwbjk",
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
                    title: "bdahajksdvjlfjletjhrgjhkwbjk"
                });

                expect(createProcess.statusCode).toBe(200);
                expect(createProcess.message).not.toBeNull();
                expect(createProcess.response).not.toBeNull();

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();

                expect(deleteProcess.statusCode).toBe(200);
                expect(deleteProcess.message).not.toBeNull();
            });
            test("[DELETE] process title missing : should delete all steps with a 400 status code", async () => {
                const response = await request(server).get("/step/deleteall").query({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });            
            test("[DELETE] process title empty : should not delete all steps with a 400 status code", async () => {
                const response = await request(server).get("/step/deleteall").query({
                    process_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE] process not found : should not delete all steps with a 404 status code", async () => {
                const response = await request(server).get("/step/deleteall").query({
                    process_title: "Unexpctedprocess"
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
    });
});