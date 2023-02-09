const request = require("supertest");
const sinon = require("sinon");
const router = require("../../src/process/index");
const Process = require("../../src/persistence/process");
const { start, stop } = require("../../index");
const Step = require("../../src/persistence/step");

describe("Steps tests", () => {
    const port = 3005;
    let server;

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
    });

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
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.create = jest.fn().mockReturnValue({ something: 'something'});
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
                Process.get = jest.fn().mockReturnValue(null);
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

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("[ADD] should throw an error if error occurs", async () => {
                try{
                    Process.get = jest.fn().mockReturnValue({ something: 'not null' });
                    sinon.stub(Step, 'create').throws(new Error('db query failed'));

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
                } catch(e){
                    expect(response.statusCode).toBe(500);
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