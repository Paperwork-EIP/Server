const request = require("supertest");
const router = require("../../src/process/index");
const routerQuestions = require("../../src/process/questions");
const { start, stop } = require("../../index");

describe("Questions tests", () => {
    const port = 3004;
    let server;

    beforeAll(async () => {
        server = start(port);
    });

    afterAll(async () => {
        stop();
    });

    describe("[UNIT TESTS]", () => {
        test("[index.js] should have a router component", () => {
            expect(router).not.toBeNull();
        });
        test("[index.js] should have instanced the router component", () => {
            expect(router).toBeDefined();
        });
        test("[questions.js] should have a router component", () => {
            expect(routerQuestions).not.toBeNull();
        });
        test("[questions.js] should have instanced the router component", () => {
            expect(routerQuestions).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID TESTS]", () => {
            test("[GET] should get questions with a 200 status code", async () => {
                const create = await request(server).post("/process/add").send({
                    title: "TestQuestions",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });

                const step = await request(server).post("/step/add").send({
                    title: "TestQuestions",
                    question: "This is a test",
                    type: "text",
                    description: "This is a test",
                    process_title: "TestQuestions",
                });

                const response = await request(server).get("/processQuestions/get").query({
                    title: "TestQuestions"
                });

                const del = await request(server).get("/process/delete").query({
                    title: "TestQuestions"
                });
                
                expect(create.statusCode).toBe(200);
                expect(create.message).not.toBeNull();
                expect(create.response).not.toBeNull();

                expect(step.statusCode).toBe(200);
                expect(step.message).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.questions).not.toBeNull();

                expect(del.statusCode).toBe(200);
                expect(del.questions).not.toBeNull();
            });
        });
        describe("[INVALID TESTS]", () => {
            test("[GET] title missing : should not get questions with a 400 status code", async () => {
                const response = await request(server).get("/processQuestions/get").query({});
                expect(response.statusCode).toBe(400);
                expect(response.questions).not.toBeNull();
            });
            test("[GET] empty title : should not get questions with a 400 status code", async () => {
                const response = await request(server).get("/processQuestions/get").query({
                    title: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response.questions).not.toBeNull();
            });
            test("[GET] process not found : should not get questions with a 404 status code", async () => {
                const response = await request(server).get("/processQuestions/get").query({
                    title: "teeeeeeeessssst"
                });
                expect(response.statusCode).toBe(404);
                expect(response.questions).not.toBeNull();
            });
            test("[GET] steps not found : should not get questions with a 404 status code", async () => {
                const create = await request(server).post("/process/add").send({
                    title: "gggdhddhdjjdjdjk",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });

                const response = await request(server).get("/processQuestions/get").query({
                    title: "gggdhddhdjjdjdjk"
                });

                const del = await request(server).get("/process/delete").query({
                    title: "gggdhddhdjjdjdjk"
                });

                expect(create.statusCode).toBe(200);
                expect(create.message).not.toBeNull();
                expect(create.response).not.toBeNull();

                expect(response.statusCode).toBe(404);
                expect(response.questions).not.toBeNull();

                expect(del.statusCode).toBe(200);
                expect(del.questions).not.toBeNull();
            });
        });
    });
});