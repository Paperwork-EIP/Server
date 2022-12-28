const request = require("supertest");
const router = require("../../src/process/index");
const routerQuestions = require("../../src/process/questions");
const { start, stop } = require("../../index");

describe("Questions tests", () => {
    const port = 3004;
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
                const response = await request(server).get("/processQuestions/get").query({
                    title: "vital"
                });
                expect(response.statusCode).toBe(200);
                expect(response.questions).not.toBeNull();
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
            test("[GET] inexistant question : should not get questions with a 404 status code", async () => {
                const response = await request(server).get("/processQuestions/get").query({
                    title: "teeeeeeeessssst"
                });
                expect(response.statusCode).toBe(404);
                expect(response.questions).not.toBeNull();
            });
        });
    });
});