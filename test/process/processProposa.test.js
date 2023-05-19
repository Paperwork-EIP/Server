const request = require("supertest");
const sinon = require("sinon");
const router = require("../../src/process/index");
const routerProposal = require("../../src/process/processProposal");
const Users = require("../../src/persistence/users");
const ProcessProposal = require("../../src/persistence/processProposal");
const { start, stop } = require("../../index");

describe("Process proposal tests", () => {
    const port = 3010;
    let server;

    beforeAll(async () => {
        server = await start(port);
    });

    afterAll(() => {
        stop();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
    });

    describe("[UNIT TESTS]", () => {
        test("[index.js] should have a router component", () => {
            expect(router).not.toBeNull();
        });
        test("[index.js] should have instanced the router component", () => {
            expect(router).toBeDefined();
        });
        test("[questions.js] should have a router component", () => {
            expect(routerProposal).not.toBeNull();
        });
        test("[questions.js] should have instanced the router component", () => {
            expect(routerProposal).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID TESTS] Process proposal", () => {
            test("[ADD] should add a process proposal with a 200 status code", async () => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                ProcessProposal.create = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitlehhhhhhhhhhhhhhhhhhh",
                    description: "TestDescription",
                    content: "TestContent",
                    user_token: "ttttttttttttttttttttttttttttttt",
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[GET ALL] should get all the process proposal with a 200 status code", async () => {
                ProcessProposal.getAll = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).get("/processProposal/getAll").send({});

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('Proposals found.');
            });
            test("[DELETE] should delete a process proposal with a 200 status code", async () => {
                ProcessProposal.get = jest.fn().mockReturnValue({ id: 1 });
                ProcessProposal.delete = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).get("/processProposal/delete").query({
                    id: 1
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
        });
        describe("[INVALID TESTS]", () => {
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "TestContent",
                    user_token: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "TestContent"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "",
                    user_token: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    user_token: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "",
                    content: "TestContent",
                    user_token: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    content: "TestContent",
                    user_token: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "",
                    description: "TestDescription",
                    content: "TestContent",
                    user_token: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    description: "TestDescription",
                    content: "TestContent",
                    user_token: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] user not found : should return a 404 status code", async () => {
                Users.findToken = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitlehhhhhhhhhhhhhhhhhhh",
                    description: "TestDescription",
                    content: "TestContent",
                    user_token: "ttttttttttttttttttttttttttttttt",
                });
                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('User not found.');
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should throw an error if error occurs", async () => {
                let response;

                try {
                    Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                    sinon.stub(ProcessProposal, 'create').throws(new Error('db query failed'));

                    response = await request(server).post("/processProposal/add").send({
                        title: "TestTitlehhhhhhhhhhhhhhhhhhh",
                        description: "TestDescription",
                        content: "TestContent",
                        user_token: "ttttttttttttttttttttttttttttttt",
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }

            });
            test("[ADD] should return a 409 error status", async () => {
                Users.findToken = jest.fn().mockReturnValue({ id: 1 });
                ProcessProposal.create = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitlehhhhhhhhhhhhhhhhhhh",
                    description: "TestDescription",
                    content: "TestContent",
                    user_token: "ttttttttttttttttttttttttttttttt",
                });

                expect(response.statusCode).toBe(409);
            });
            test("[ADD] should throw an error if error occurs", async () => {
                let response;

                try {
                    sinon.stub(Users, 'findToken').throws(new Error('db query failed'));

                    response = await request(server).post("/processProposal/add").send({
                        title: "TestTitlehhhhhhhhhhhhhhhhhhh",
                        description: "TestDescription",
                        content: "TestContent",
                        user_token: "ttttttttttttttttttttttttttttttt",
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }

            });
            test("[GET ALL] should throw an error if error occurs", async () => {
                let response;

                try {
                    sinon.stub(ProcessProposal, 'getAll').throws(new Error('db query failed'));

                    response = await request(server).get("/processProposal/getAll").send({});
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }
            });
            test("[DELETE] should not delete a process proposal with a 400 status code", async () => {
                const response = await request(server).get("/processProposal/delete").query({
                    id: null
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should not delete a process proposal with a 400 status code", async () => {
                const response = await request(server).get("/processProposal/delete").query({
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should not delete a process proposal with a 404 status code", async () => {
                ProcessProposal.get = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/processProposal/delete").query({
                    id: 4294967
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should throw an error if error occurs", async () => {
                let response;

                try {
                    ProcessProposal.get = jest.fn().mockReturnValue({ id: 1 });
                    sinon.stub(ProcessProposal, 'delete').throws(new Error('db query failed'));

                    response = await request(server).get("/processProposal/delete").query({
                        id: 4294967
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }
            });
        });
    });
});