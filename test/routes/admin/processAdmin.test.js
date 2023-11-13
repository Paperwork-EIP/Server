const request = require("supertest");
const sinon = require("sinon");
const router = require("../../../src/routes/router");
const routerAdmin = require("../../../src/routes/admin/adminRouter");
const Process = require('../../../src/persistence/process/process');
const Step = require('../../../src/persistence/process/step');
const UserProcess = require('../../../src/persistence/userProcess/userProcess');
const { start, stop } = require("../../../index");
const fs = require('fs');

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

jest.mock('fs');

describe("Admin tests", () => {
    const port = 3030;
    let server;

    beforeEach(() => {
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
        describe("[VALID ADMIN PROCESS TESTS]", () => {
            test("[CREATE] should create a process with a 200 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Process.create = jest.fn().mockReturnValue({ something: 'not null' });
                Step.create = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).post("/admin/process/add").send({
                    title: title,
                    content: content,
                    delay: delay
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("Process created!");
                expect(response._body.response).not.toBeNull();
                expect(response._body.steps).not.toBeNull();
            });
            test("[CREATE] no delay : should create a process with a 200 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Process.create = jest.fn().mockReturnValue({ something: 'not null' });
                Step.create = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).post("/admin/process/add").send({
                    title: title,
                    content: content,
                    delay: ""
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("Process created!");
            });
            test("[DELETE] should delete a process with a 200 status code", async() => {
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.deleteAll = jest.fn().mockReturnValue({ something: 'something' });
                UserProcess.deleteAll = jest.fn().mockReturnValue({ id: 1 });
                Process.delete = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).get("/admin/process/delete").query({
                    title: title
                });

                expect(response.statusCode).toBe(200);
                expect(response._body.message).toEqual("Process and steps deleted!");
                expect(response._body.response).not.toBeNull();
            });
        });

        describe("[INVALID ADMIN PROCESS TESTS]", () => {
            test("[CREATE] no title : should not create a process with a 400 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Process.create = jest.fn().mockReturnValue({ something: 'not null' });
                Step.create = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).post("/admin/process/add").send({
                    title: "",
                    content: content,
                    delay: delay
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Title or content missing");
            });
            test("[CREATE] no content : should not create a process with a 400 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Process.create = jest.fn().mockReturnValue({ something: 'not null' });
                Step.create = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).post("/admin/process/add").send({
                    title: title,
                    content: "",
                    delay: delay
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Title or content missing");
            });
            test("[CREATE] process found : should not create a process with a 400 status code", async() => {
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Process.create = jest.fn().mockReturnValue({ something: 'not null' });
                Step.create = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).post("/admin/process/add").send({
                    title: title,
                    content: content,
                    delay: delay
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Process already exists.");
            });
            test("[CREATE] write file error : should not create a process with a 500 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Process.create = jest.fn().mockReturnValue({ id: 1 });
                Step.create = jest.fn().mockReturnValue({ id: 1 });
                jest.spyOn(fs, 'writeFile').mockImplementation((path, data, callback) => { callback(new Error("Error writing file.")) });

                const response = await request(server).post("/admin/process/add").send({
                    title: title,
                    content: content,
                    delay: delay
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("Error writing file.");
            });
            test("[CREATE] system error : should not create a process with a 500 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Process.create = jest.fn().mockReturnValue({ id: 1 });
                Step.create = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).post("/admin/process/add").send({
                    title: title,
                    content: content,
                    delay: delay
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
            test("[DELETE] no title : should not delete a process with a 400 status code", async() => {
                Process.get = jest.fn().mockReturnValue({ id: 1 });
                Step.deleteAll = jest.fn().mockReturnValue({ something: 'something' });
                UserProcess.deleteAll = jest.fn().mockReturnValue({ id: 1 });
                Process.delete = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).get("/admin/process/delete").query({
                    title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[DELETE] process not found : should not delete a process with a 400 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);
                Step.deleteAll = jest.fn().mockReturnValue({ something: 'something' });
                UserProcess.deleteAll = jest.fn().mockReturnValue({ id: 1 });
                Process.delete = jest.fn().mockReturnValue({ something: 'not null' });

                const response = await request(server).get("/admin/process/delete").query({
                    title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
                expect(response._body.response).not.toBeNull();
            });
            test("[DELETE] system error : should not delete a process with a 500 status code", async() => {
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).get("/admin/process/delete").query({
                    title: title
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
            test("[MODIFY] no title : should not modify a process with a 400 status code", async() => {
                const response = await request(server).post("/admin/process/modify").send({
                    language: "français"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[MODIFY] empty title : should not modify a process with a 400 status code", async() => {
                const response = await request(server).post("/admin/process/modify").send({
                    stocked_title: "",
                    language: "français"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[MODIFY] no language : should not modify a process with a 400 status code", async() => {
                const response = await request(server).post("/admin/process/modify").send({
                    stocked_title: "test"
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[MODIFY] empty language : should not modify a process with a 400 status code", async() => {
                const response = await request(server).post("/admin/process/modify").send({
                    stocked_title: "test",
                    language: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[MODIFY] process not found : should not modify a process with a 404 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).post("/admin/process/modify").send({
                    stocked_title: "test",
                    title: title,
                    description: "descriptionTest",
                    source: "fr",
                    delay: delay,
                    language: "français"
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
                expect(response._body.response).not.toBeNull();
            });
            test("[MODIFY] system error : should not modify a process with a 500 status code", async() => {
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).post("/admin/process/modify").send({
                    stocked_title: "test",
                    title: title,
                    description: "descriptionTest",
                    source: "fr",
                    delay: delay,
                    language: "français"
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
            test("[GET] empty title : should not get a process with a 400 status code", async() => {
                const response = await request(server).get("/admin/process/get").query({
                    stocked_title: ""
                });

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET] no title : should not get a process with a 400 status code", async() => {
                const response = await request(server).get("/admin/process/get").query({});

                expect(response.statusCode).toBe(400);
                expect(response._body.message).toEqual("Missing parameters.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET] process not found : should not get a process with a 404 status code", async() => {
                Process.get = jest.fn().mockReturnValue(null);

                const response = await request(server).get("/admin/process/get").query({
                    stocked_title: title
                });

                expect(response.statusCode).toBe(404);
                expect(response._body.message).toEqual("Process not found.");
                expect(response._body.response).not.toBeNull();
            });
            test("[GET] system error : should not get a process with a 500 status code", async() => {
                Process.get = jest.fn().mockRejectedValue(new Error("System error."));

                const response = await request(server).get("/admin/process/get").query({
                    stocked_title: title
                });

                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual("System error.");
            });
        });
    });
})