const request = require("supertest");
const sinon = require("sinon");
const router = require("../../../src/routes/users/index");
const Process = require("../../../src/persistence/process/process");
const { start, stop } = require("../../../index");
const Step = require("../../../src/persistence/process/step");

describe("Steps tests", () => {
    const port = 3005;
    let server;

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
    });

    beforeAll(async () => {
        server = await start(port);
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
                Process.get = jest.fn().mockReturnValue({ id: 1, title: "Visa" });
                Step.create = jest.fn().mockReturnValue({ something: 'something'});
                const response = await request(server).post("/step/add").send({
                    title: "TestStep",
                    is_unique: true,
                    delay: null,
                    process_title: "Visa"
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('Step created!');
            });
            test("[DELETE ALL] should delete all steps with a 200 status code", async () => {
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.deleteAll = jest.fn().mockReturnValue({ something: 'something'});
                
                const response = await request(server).get("/step/deleteall").query({
                    process_title: "vhffdguergrhgoorgggggg"
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual('Steps delete!');
            });
        });
        describe("[INVALID STEP TESTS]", () => {
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
                Process.get = jest.fn().mockReturnValue(null);
                const response = await request(server).post("/step/add").send({
                    is_unique: true,
                    delay: null,
                    process_title: "Unexpcted procss"
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] should add a step with a 404 statuc code(no more step to create)", async () => {
                Process.get = jest.fn().mockReturnValue({id: 1, title: "Visa"});
                Step.getByProcess = jest.fn().mockReturnValue([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
                const response = await request(server).post("/step/add").send({
                    is_unique: true,
                    delay: null,
                    process_title: "Visa"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('There is no more step to create for this process.');
            });
            test("[ADD] Data not found : should not create a step with a 404 status code(file empty)", async () => {
                Process.get = jest.fn().mockReturnValue({id: 1, title: "Visa"});
                jest.mock('../../../src/data/Visa.json', () => null);
                const response = await request(server).post("/step/add").send({
                    is_unique: true,
                    delay: null,
                    process_title: "Unexpcted procss"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[ADD] Data not found : should not create a step with a 404 status code(file don't exist)", async () => {
                Process.get = jest.fn().mockReturnValue({id: 1, title: "Visaxsxsx"});
                const response = await request(server).post("/step/add").send({
                    is_unique: true,
                    delay: null,
                    process_title: "Unexpcted procss"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual('Data not found.');
            });
            test("[ADD] should throw an error with a 500 status code", async () => {
                let response;
                try {
                    Process.get = jest.fn().mockReturnValue({ id: 1 });
                    sinon.stub(Step, 'create').throws(new Error('db query failed'));
                    
                    response = await request(server).get("/step/add").query({
                        process_title: "vhffdguergrhgoorgggggg"
                    });
                } catch(e){
                    expect(response.statusCode).toBe(500);
                    expect(response._body.message).toEqual('System error.');
                }
            });
            test("[DELETE ALL] process title missing : should delete all steps with a 400 status code", async () => {
                const response = await request(server).get("/step/deleteall").query({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });            
            test("[DELETE ALL] process title empty : should not delete all steps with a 400 status code", async () => {
                const response = await request(server).get("/step/deleteall").query({
                    process_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE ALL] process not found : should not delete all steps with a 404 status code", async () => {
                Process.get = jest.fn().mockReturnValue(null);
                const response = await request(server).get("/step/deleteall").query({
                    process_title: "Unexpctedprocess"
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[DELETE ALL] should throw an error if error occurs", async () => {
                try {
                    Process.get = jest.fn().mockReturnValue({ id: 1 });
                    sinon.stub(Step, 'deleteAll').throws(new Error('db query failed'));
                    
                    const response = await request(server).get("/step/deleteall").query({
                        process_title: "vhffdguergrhgoorgggggg"
                    });
                } catch(e){
                    expect(response.statusCode).toBe(500);
                    expect(response._body.message).toEqual('System error.');
                }
            });
        });
    });
});