const request = require("supertest");
const sinon = require("sinon");
const router = require("../../src/process/index");
const routerQuestions = require("../../src/process/questions");
const Process = require("../../src/persistence/process");
const Step = require("../../src/persistence/step");
const db = require('../../src/persistence/db');
const { start, stop } = require("../../index");

describe("Questions tests", () => {
    const port = 3004;
    let server;

    afterEach(() => {
        jest.restoreAllMocks();
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
        test("[questions.js] should have a router component", () => {
            expect(routerQuestions).not.toBeNull();
        });
        test("[questions.js] should have instanced the router component", () => {
            expect(routerQuestions).toBeDefined();
        });
        test('[GET] should throw an error if an error occurs', async () => {
            let response;

            try {
                db.query = jest.fn().mockResolvedValue(() => { throw new Error });

                response = await request(server).get("/processQuestions/get").query({
                    title: "TestQuestions"
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(JSON.parse(response.text).message).toEqual('System error.');
            }
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID TESTS]", () => {
            test("[GET] should get questions with a 200 status code", async () => {
                const data = [{
                    id: 1,
                    question: 'test'
                }];

                Process.get = jest.fn().mockReturnValue({ id: 1, title: "Visa" });
                Step.getByProcess = jest.fn().mockReturnValue(data);

                const response = await request(server).get("/processQuestions/get").query({
                    title: "TestQuestions",
                    language: "english"
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.questions).not.toBeNull();
            });
        });
        describe("[INVALID TESTS]", () => {
            test("[GET] title missing : should not get questions with a 400 status code", async () => {
                const response = await request(server).get("/processQuestions/get").query({});
                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual('Missing parameters.');
            });
            test("[GET] empty title : should not get questions with a 400 status code", async () => {
                const response = await request(server).get("/processQuestions/get").query({
                    title: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual('Missing parameters.');
            });
            test("[GET] empty language : should not get questions with a 400 status code", async () => {
                const response = await request(server).get("/processQuestions/get").query({
                    language: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual('Missing parameters.');
            });
            test("[GET] process not found : should not get questions with a 404 status code", async () => {
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/processQuestions/get").query({
                    title: "teeeeeeeessssst",
                    language: "english"
                });
                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Process not found.');
            });
            test("[GET] steps not found : should not get questions with a 404 status code", async () => {
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                Step.getByProcess = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/processQuestions/get").query({
                    title: "gggdhddhdjjdjdjk",
                    language: "english"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Steps not found.');
            });
            test("[GET] Data not found : should not get questions with a 404 status code", async () => {
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'cdcsdVisa' });
                Step.getByProcess = jest.fn().mockReturnValue({id:1});

                const response = await request(server).get("/processQuestions/get").query({
                    title: "gggdhddhdjjdjdjk",
                    language: "english"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET] Data not found : should not get questions with a 404 status code", async () => {
                Process.get = jest.fn().mockReturnValue({ id: 1, title: 'Visa' });
                Step.getByProcess = jest.fn().mockReturnValue({id:1});
                jest.mock('../../src/data/Visa.json', () => null);

                const response = await request(server).get("/processQuestions/get").query({
                    title: "gggdhddhdjjdjdjk",
                    language: "english"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[GET] should throw an error if error occurs", async () => {
                let response;

                try {
                    sinon.stub(Process, 'get').throws(new Error('db query failed'));

                    response = await request(server).get("/processQuestions/get").query({
                        title: "teeeeeeeessssst",
                        language: "english"
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }
            });
        });
    });
});