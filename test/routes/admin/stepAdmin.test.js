const request = require("supertest");
const sinon = require("sinon");
const router = require("../../../src/routes/router");
const routerAdmin = require("../../../src/routes/admin/adminRouter");
const Process = require('../../../src/persistence/process/process');
const Step = require('../../../src/persistence/process/step');
const UserProcess = require('../../../src/persistence/userProcess/userProcess');
const Tools = require('../../../src/tools');
const { start, stop } = require("../../../index");
const fs = require('fs');
const { getStepData, getUnderStepData } = require('../../../src/routes/admin/stepAdmin');
const Users = require('../../../src/persistence/users/users');
const path = require('path');

const title = "test";
const content = {
    english: {
        title: "test.",
        description: "blablabla",
        source: "styler",
        steps: [{
            title: "titleTest",
            type: "documentTest",
            description: "descriptionTest",
            question: "questionTest",
            source: "sourceTest"
        }, ]
    },
    français: {
        title: "Long-term visa.",
        description: "blablabla",
        source: "styler",
        steps: [{
            title: "titleTest",
            type: "documentTest",
            description: "descriptionTest",
            question: "questionTest",
            source: "sourceTest"
        }, ]
    }
};
const delay = "test delay";

describe("Admin tests", () => {
    const port = 3032;
    let server;

    beforeEach(() => {
        fs.promises.readFile = jest.fn().mockResolvedValue(JSON.stringify(content));
        fs.promises.writeFile = jest.fn().mockResolvedValue();
        jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => { callback(null, content) });
        jest.spyOn(fs, 'writeFile').mockImplementation((path, data, callback) => { callback(null) });
        jest.spyOn(fs, 'readFileSync').mockImplementation((path, options) => { return content });
        jest.spyOn(fs, 'unlink').mockImplementation((path, callback) => { callback(null) });
    });

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
            expect(routerAdmin).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", () => {
            expect(routerAdmin).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("getStepData tests", () => {
            const stocked_title = "test";
            const step_id = 1;
            const allSteps = [{ id: 1 }];
        
            test("should return an array of steps with the specified step_id", async () => {
                const file = {
                    english: {
                        steps: [
                            {
                                title: "titleTest",
                                type: "documentTest",
                                description: "descriptionTest",
                                question: "questionTest",
                                source: "sourceTest",
                                delay: "test delay",
                                underQuestions: []
                            }
                        ]
                    }
                };
        
                jest.spyOn(Tools, 'getData').mockResolvedValue(file);
                jest.fn(getUnderStepData).mockReturnValue([]);
        
                const result = await getStepData(stocked_title, step_id, allSteps);
        
                expect(result).toEqual([
                    {
                        language: "english",
                        step_id: 1,
                        number: "0",
                        content: {
                            title: "titleTest",
                            type: "documentTest",
                            description: "descriptionTest",
                            question: "questionTest",
                            source: "sourceTest",
                            delay: "test delay",
                            underQuestions: []
                        }
                    }
                ]);
            });
        
            test("should return an empty array if no steps with the specified step_id exist", async () => {
                const file = {
                    english: {
                        steps: [
                            {
                                title: "titleTest",
                                type: "documentTest",
                                description: "descriptionTest",
                                question: "questionTest",
                                source: "sourceTest",
                                delay: "test delay"
                            }
                        ]
                    }
                };
        
                jest.spyOn(Tools, 'getData').mockResolvedValue(file);
                jest.fn(getUnderStepData).mockReturnValue([]);
        
                const result = await getStepData(stocked_title, 2, allSteps);
        
                expect(result).toEqual([]);
            });
        });
        describe("getUnderStepData tests", () => {
            test("should return an array of under questions", () => {
                const file = {
                    english: {
                        steps: [
                            {
                                underQuestions: {
                                    1: {
                                        title: "Under Question 1",
                                        type: "Type 1",
                                        description: "Description 1",
                                        source: "Source 1",
                                        question: "Question 1"
                                    },
                                    2: {
                                        title: "Under Question 2",
                                        type: "Type 2",
                                        description: "Description 2",
                                        source: "Source 2",
                                        question: "Question 2"
                                    }
                                }
                            }
                        ]
                    }
                };
                const i = 0;
                const j = 0;
        
                const result = getUnderStepData(file, i, j);
        
                expect(result).toEqual([
                    {
                        id: "1",
                        title: "Under Question 1",
                        type: "Type 1",
                        description: "Description 1",
                        source: "Source 1",
                        question: "Question 1"
                    },
                    {
                        id: "2",
                        title: "Under Question 2",
                        type: "Type 2",
                        description: "Description 2",
                        source: "Source 2",
                        question: "Question 2"
                    }
                ]);
            });
        
            test("should return an empty array if no under questions exist", () => {
                const file = {
                    english: {
                        steps: [
                            {
                                underQuestions: {}
                            }
                        ]
                    }
                };
                const i = 0;
                const j = 0;
        
                const result = getUnderStepData(file, i, j);
        
                expect(result).toEqual([]);
            });
        });
        describe("[VALID ADMIN STEP TESTS]", () => {
            test("[GET ALL] should get all steps with a 200 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getByProcess = jest.fn().mockReturnValue([{ id: 1 }]);
                Tools.getData = jest.fn().mockReturnValue({
                    english: {
                        title: "test.",
                        description: "blablabla",
                        source: "styler",
                        steps: [{
                            id: 1,
                            title: "titleTest",
                            type: "documentTest",
                            description: "descriptionTest",
                            question: "questionTest",
                            source: "sourceTest"
                        }]
                    }
                });

                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title,
                    language: "english"
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("Steps found!");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] should get a step with a 200 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({
                    id: 1,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest"
                });

                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("Step found!");
                expect(response._body.response).not.toBeNull();
            });
        });
        describe("[INVALID ADMIN STEP TESTS]", () => {
            test("[ADD] no token : should not add a step with a 400 status code", async() => {
                const response = await request(server).post("/admin/step/add").send({
                    stocked_title: "test",
                    newStep: {
                        title: "titleTest",
                        type: "documentTest",
                        description: "descriptionTest",
                        question: "questionTest",
                        source: "sourceTest"
                    },
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[ADD] unauthorized : should not add a step with a 403 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(false);
                const response = await request(server).post("/admin/step/add").send({
                    token: "test",
                    stocked_title: "test",
                    newStep: {
                        title: "titleTest",
                        type: "documentTest",
                        description: "descriptionTest",
                        question: "questionTest",
                        source: "sourceTest"
                    },
                });

                expect(response.statusCode).toBe(403);
                expect(response._body.message).toEqual("Unauthorized.");
            });
            test("[ADD] no stocked_title : should not add a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/add").send({
                    newStep: {
                        title: "titleTest",
                        type: "documentTest",
                        description: "descriptionTest",
                        question: "questionTest",
                        source: "sourceTest"
                    },
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[ADD] no newStep : should not add a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/add").send({
                    stocked_title: "test"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[ADD] empty stocked_title : should not add a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/add").send({
                    stocked_title: "",
                    newStep: {
                        title: "titleTest",
                        type: "documentTest",
                        description: "descriptionTest",
                        question: "questionTest",
                        source: "sourceTest"
                    },
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[ADD] empty newStep : should not add a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/add").send({
                    stocked_title: "test",
                    token: "test",
                    newStep: null
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[ADD] Missing data in newStep : should not add a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/add").send({
                    stocked_title: "test",
                    token: "test",
                    newStep: {
                        title: "titleTest",
                        type: "documentTest",
                        description: "descriptionTest",
                        question: "questionTest"
                    },
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing data in the new step.");
            });
            test("[ADD] process not found : should not add a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/admin/step/add").send({
                    stocked_title: "test",
                    token: "test",
                    newStep: {
                        title: "titleTest",
                        type: "documentTest",
                        description: "descriptionTest",
                        question: "questionTest",
                        source: "sourceTest"
                    },
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
            });
            test("[ADD] system error : should not add a step with a 500 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).post("/admin/step/add").send({
                    stocked_title: "test",
                    token: "test",
                    newStep: {
                        title: "titleTest",
                        type: "documentTest",
                        description: "descriptionTest",
                        question: "questionTest",
                        source: "sourceTest"
                    },
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
            test("[GET STEP] missing token : should not get a step with a 400 status code", async() => {
                const response = await request(server).get("/admin/step/get").query({
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] unauthorized : should not get a step with a 403 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(false);
                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(403);
                expect(response._body.message).toEqual("Unauthorized.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] no step id : should not get a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/get").query({
                    stocked_title: title
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] no title : should not get a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] empty title : should not get a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] empty step id : should not get a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: "",
                    stocked_title: title
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] process not found : should not get a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] step not found : should not get a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Step not found.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] steps not found : should not get a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ id: 1 });
                Step.getByProcess = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Steps not found.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET STEP] system error : should not get a step with a 500 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).get("/admin/step/get").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
            test("[UPDATE STEP] no token : should not update a step with a 400 status code", async() => {
                const response = await request(server).post("/admin/step/modify").send({
                    stocked_title: title,
                    step_id: 1,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[UPDATE STEP] unauthorized : should not update a step with a 403 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(false);
                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    stocked_title: title,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français",
                    newStep: "newStepTestLol"
                });

                expect(response.statusCode).toBe(403);
                expect(response._body.message).toEqual("Unauthorized.");
            });
            test("[UPDATE STEP] no step id : should not update a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    stocked_title: title,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[UPDATE STEP] no stocked_title : should not update a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    title: "titleTest",
                    language: "français"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[UPDATE STEP] no language : should not update a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    stocked_title: title,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[UPDATE STEP] empty stocked_title : should not update a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    stocked_title: "",
                    title: "test",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[UPDATE STEP] empty step id : should not update a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: "",
                    stocked_title: title,
                    title: "test",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[UPDATE STEP] empty language : should not update a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    stocked_title: title,
                    title: "test",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[UPDATE STEP] process not found : should not update a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    stocked_title: title,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français",
                    newStep: "newStepTestLol"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
            });
            test("[UPDATE STEP] step not found : should not update a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    stocked_title: title,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français",
                    newStep: "newStepTestLol"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Step not found.");
            });
            test("[UPDATE STEP] system error : should not update a step with a 500 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).post("/admin/step/modify").send({
                    token: "test",
                    step_id: 1,
                    stocked_title: title,
                    title: "titleTest",
                    type: "documentTest",
                    description: "descriptionTest",
                    question: "questionTest",
                    source: "sourceTest",
                    language: "français",
                    newStep: "teststepnew"
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
            test("[GET ALL] no token : should not get all steps with a 400 status code", async() => {
                const response = await request(server).get("/admin/step/getAll").query({
                    stocked_title: title,
                    language: "english"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[GET ALL] unauthorized : should not get all steps with a 403 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(false);
                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title,
                    language: "english"
                });

                expect(response.statusCode).toBe(403);
                expect(response._body.message).toEqual("Unauthorized.");
            });
            test("[GET ALL] empty title : should not get all steps with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: "",
                    language: "english"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[GET ALL] empty language : should not get all steps with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title,
                    language: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[GET ALL] no title : should not get all steps with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    language: "english"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[GET ALL] no language : should not get all steps with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[GET ALL] process not found : should not get all steps with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title,
                    language: "english"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
            });
            test("[GET ALL] data not found : should not get all steps with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getByProcess = jest.fn().mockReturnValue({ id: 1 });
                Tools.getData = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title,
                    language: "english"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Data not found.");
            });
            test("[GET ALL] step not found : should not get all steps with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getByProcess = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title,
                    language: "english"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Steps not found.");
            });
            test("[GET ALL] system error : should not get all steps with a 500 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).get("/admin/step/getAll").query({
                    token: "test",
                    stocked_title: title,
                    language: "english"
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
            test("[DELETE] no token : should not delete a step with a 400 status code", async() => {
                const response = await request(server).get("/admin/step/delete").query({
                    stocked_title: title,
                    step_id: 1
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[DELETE] unauthorized : should not delete a step with a 403 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(false);
                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    stocked_title: title,
                    step_id: 1
                });

                expect(response.statusCode).toBe(403);
                expect(response._body.message).toEqual("Unauthorized.");
            });
            test("[DELETE] no step id : should not delete a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    stocked_title: title
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[DELETE] no stocked_title : should not delete a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    step_id: 1
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[DELETE] empty stocked_title : should not delete a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[DELETE] empty step id : should not delete a step with a 400 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    step_id: "",
                    stocked_title: title
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
            });
            test("[DELETE] process not found : should not delete a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
            });
            test("[DELETE] step not found : should not delete a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Step not found.");
            });
            test("[DELETE] steps not found : should not delete a step with a 404 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.getById = jest.fn().mockReturnValue({ id: 1 });
                Step.getByProcess = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Steps not found.");
            });
            test("[DELETE] system error : should not delete a step with a 500 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).get("/admin/step/delete").query({
                    token: "test",
                    step_id: 1,
                    stocked_title: title
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
        });
    });
});