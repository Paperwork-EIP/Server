const request = require("supertest");
const sinon = require("sinon");
const router = require("../../../src/routes/router");
const routerProcess = require("../../../src/routes/process/process");
const Process = require("../../../src/persistence/process/process");
const { start, stop } = require("../../../index");
const Step = require("../../../src/persistence/process/step");

describe("Process tests", () => {
    const port = 3003;
    let server;

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
        test("[index.js] should have a router component", () => {
            expect(router).not.toBeNull();
        });
        test("[index.js] should have instanced the router component", () => {
            expect(router).toBeDefined();
        });
        test("[process.js] should have a router component", () => {
            expect(routerProcess).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", () => {
            expect(routerProcess).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID PROCESS TESTS]", () => {
            test("[ADD] should create and add a process in the database with a 200 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Process.create = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).post("/process/add").send({
                    title: "hyyyydhshdjjdsdisiiiii",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[DELETE] should delete a process with a 200 status code", async() => {
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.deleteAll = jest.fn().mockReturnValue({ something: 'not null' });
                Process.delete = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).get("/process/delete").query({
                    title: "hyyyydhshdjjdsdisiiiii"
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('Process and steps deleted!');
            });
            test("[GET ALL] should get all process with a 200 status code", async() => {
                Process.getAll = jest.fn().mockReturnValue([{ id: 1, title: 'Visa' }]);

                const response = await request(server).get("/process/getAll?language=english").query({});

                expect(response.statusCode).toBe(200);
                expect(response.response).not.toBeNull();
            });
        });
        describe("[INVALID PROCESS TESTS]", () => {
            test("[ADD] title missing : should not create a process with a 400 status code", async() => {
                const response = await request(server).post("/process/add").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] title empty : should not create a process with a 400 status code", async() => {
                const response = await request(server).post("/process/add").send({
                    title: "",
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] process already created : should not create a process with a 400 status code", async() => {
                Process.get = jest.fn().mockResolvedValue({ something: 'something' });
                Process.create = jest.fn().mockResolvedValue({ something: 'something' });

                const response = await request(server).post("/process/add").send({
                    title: "Testtttthhhhhhyyyyyy",
                    description: "test"
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test('[ADD] should throw an error if an error occurs', async() => {
                let response;

                try {
                    sinon.stub(Process, 'get').throws(new Error('db query failed'));

                    response = await request(server).post("/process/add").send({
                        title: 'qwe',
                        description: "This is a test",
                        source: null,
                        delay: null
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                    expect(JSON.parse(response.text).message).toEqual('System error.');
                }

            });
            test("[DELETE] title missing : should not delete a process with a 400 status code", async() => {
                const response = await request(server).get("/process/delete").query({});
                expect(response.statusCode).toBe(400);
                expect(JSON.parse(response.text).message).toEqual('Missing parameters.');
            });
            test("[DELETE] title empty : should not delete a process with a 400 status code", async() => {
                const response = await request(server).get("/process/delete").query({
                    title: ""
                });
                expect(response.statusCode).toBe(400);
                expect(JSON.parse(response.text).message).toEqual('Missing parameters.');
            });
            test("[DELETE] process not found : should not delete a process with a 404 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/process/delete").query({
                    title: " "
                });
                expect(response.statusCode).toBe(404);
                expect(JSON.parse(response.text).message).toEqual('Process not found.');
            });
            test('[DELETE] should throw an error if an error occurs', async() => {
                let response;

                try {
                    Process.get = jest.fn().mockReturnValue({ id: 1 });
                    sinon.stub(Step, 'deleteAll').throws(new Error('db query failed'));

                    response = await request(server).get("/process/delete").query({
                        title: 'qwe'
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }

            });
            test("[DELETE] process not found : should not delete a process with a 404 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/process/delete").query({
                    title: " "
                });
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] wrong type of request : should be a GET request", async() => {
                const response_post = await request(server).post("/process/getAll").query({});
                const response_put = await request(server).put("/process/getAll").query({});
                const response_delete = await request(server).delete("/process/getAll").query({});

                expect(response_post.statusCode).toBe(404);
                expect(response_post.message).not.toBeNull();
                expect(response_put.statusCode).toBe(404);
                expect(response_put.message).not.toBeNull();
                expect(response_delete.statusCode).toBe(404);
                expect(response_delete.message).not.toBeNull();
            });
            test("[GET ALL] data not found : should not get all the processes with a 404 status code", async() => {
                Process.getAll = jest.fn().mockReturnValue([{ id: 1, title: 'Viscscsa' }]);
                const response = await request(server).get("/process/getAll?language=english").query({});
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] data not found : should not get all the processes with a 404 status code", async() => {
                Process.getAll = jest.fn().mockReturnValue([{ id: 1, title: 'Visa' }]);
                jest.mock('../../../src/data/Visa.json', () => null);
                const response = await request(server).get("/process/getAll?language=english").query({});
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] missing language : should not get all the processes with a 400 status code", async() => {
                Process.getAll = jest.fn().mockReturnValue({ id: 1, title: 'ddenjkfrsf' });
                const response = await request(server).get("/process/getAll").query({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[GET ALL] empty language : should not get all the processes with a 400 status code", async() => {
                Process.getAll = jest.fn().mockReturnValue([{ id: 1, title: 'ddenjkfrsf' }]);
                const response = await request(server).get("/process/getAll?language=").query({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[GETALL] should throw an error if error occurs", async() => {
                let response;

                try {
                    sinon.stub(Process, 'getAll').throws(new Error('db query failed'));

                    response = await request(server).get("/process/getAll").query({
                        language: "english"
                    });
                } catch (error) {
                    expect(response.statusCode).toBe(500);
                }
            });
        });
    });
});