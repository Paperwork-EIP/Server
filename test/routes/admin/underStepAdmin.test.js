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
const path = require('path');
const Users = require('../../../src/persistence/users/users');

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
const newUnderStep = {
    title: "test",
    type: "test",
    description: "test",
    question: "test",
    source: "test"
};
const delay = "test delay";

describe("Admin tests", () => {
    const port = 3031;
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
        describe("[VALID ADMIN UNDER STEPS TESTS]", () => {
            test("[GET ALL] should get the steps with a 200 status code", async() => {
                Users.isAdmin = jest.fn().mockReturnValue(true);
                Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
                Step.getByProcess = jest.fn().mockResolvedValueOnce([{ id: 1 }]);
                Tools.getData = jest.fn().mockResolvedValueOnce({
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
                });

                const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english&step_id=1");
                expect(response.statusCode).toBe(200);
                expect(response._body).toEqual({
                    message: "Steps found!",
                    stocked_title: "test",
                    step_id: "1",
                    underSteps: []
                });
            });
        });
    });
    describe("[INVALID ADMIN UNDER STEPS TESTS]", () => {
        test("[GET ALL] missing token : should not get the steps with a 400 status code", async() => {
            const response = await request(server).get("/admin/underStep/getAll?stocked_title=test&language=english&step_id=1");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] unauthorized : should not get the steps with a 403 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(false);
            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english&step_id=1");
            expect(response.statusCode).toBe(403);
        });
        test("[GET ALL] missing stocked_title : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll?token=test&language=english&step_id=1");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] missing language : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&step_id=1");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] missing step_id : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] missing all : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] empty all : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=&language=&step_id=");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] empty stocked_title : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll?token=test&language=english&step_id=1&stocked_title=");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] empty language : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&step_id=1&language=");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] empty step_id : should not get the steps with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english&");
            expect(response.statusCode).toBe(400);
        });
        test("[GET ALL] process doesn't exist : should not get the steps with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english&step_id=1");
            expect(response.statusCode).toBe(404);
        });
        test("[GET ALL] step doesn't exist : should not get the steps with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getByProcess = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english&step_id=1");
            expect(response.statusCode).toBe(404);
        });
        test("[GET ALL] data not found : should not get the steps with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getByProcess = jest.fn().mockResolvedValueOnce([{ id: 1 }]);
            Tools.getData = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english&step_id=1");
            expect(response.statusCode).toBe(404);
        });
        test("[GET ALL] system error : should not get the steps with a 500 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockRejectedValueOnce(new Error());

            const response = await request(server).get("/admin/underStep/getAll?token=test&stocked_title=test&language=english&step_id=1");
            expect(response.statusCode).toBe(500);
        });
        test("[ADD] missing token : should not add the step with a 400 status code", async() => {
            const response = await request(server).post(`/admin/underStep/add`).send({ newUnderStep: newUnderStep, step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] unauthorized : should not add the step with a 403 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(false);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(403);
        });
        test("[ADD] missing stocked_title : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1 });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] missing step_id : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, stocked_title: "test" });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] missing newUnderStep : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] missing all : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({});
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] empty all : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "", newUnderStep: "", step_id: "", stocked_title: "" });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] empty stocked_title : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "" });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] empty step_id : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: "", stocked_title: "test" });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] empty newUnderStep : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: "", step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(400);
        });
        test("[ADD] missing data in the newUnderStep : should not add the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: {}, step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(400);
            expect(response._body.message).toEqual("Missing data in the new under step.");
        });
        test("[ADD] process doesn't exist : should not add the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(404);
            expect(response._body.message).toEqual("Process not found.");
        });
        test("[ADD] step doesn't exist : should not add the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getById = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(404);
        });
        test("[ADD] steps doesn't exist : should not add the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getById = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getByProcess = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(404);
        });
        test("[ADD] system error : should not add the step with a 500 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockRejectedValueOnce(new Error());

            const response = await request(server).post(`/admin/underStep/add`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test" });
            expect(response.statusCode).toBe(500);
        });
        test("[MODIFY] missing token : should not modify the step with a 400 status code", async() => {
            const response = await request(server).post(`/admin/underStep/modify`).send({
                newUnderStep: newUnderStep,
                step_id: 1,
                stocked_title: "test",
                underStep_id: 1,
                language: "english"
            });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] unauthorized : should not modify the step with a 403 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(false);
            const response = await request(server).post(`/admin/underStep/modify`).send({
                token: "test",
                newUnderStep: newUnderStep,
                step_id: 1,
                stocked_title: "test",
                underStep_id: 1,
                language: "english"
            });
            expect(response.statusCode).toBe(403);
        });
        test("[MODIFY] missing stocked_title : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] missing step_id : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`).send({ token: "test", newUnderStep: newUnderStep, stocked_title: "test", underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] missing newUnderStep : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`).send({ token: "test", step_id: 1, stocked_title: "test", underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] missing underStep_id : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test", language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] missing language : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test", underStep_id: 1 });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] missing all : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`);
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] empty all : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`).send({ token: "test", newUnderStep: "", step_id: "", stocked_title: "", underStep_id: "", language: "" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] empty stocked_title : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post(`/admin/underStep/modify`).send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "", underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] empty step_id : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post("/admin/underStep/modify").send({ token: "test", newUnderStep: newUnderStep, step_id: "", stocked_title: "test", underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] empty newUnderStep : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post("/admin/underStep/modify").send({ token: "test", newUnderStep: "", step_id: 1, stocked_title: "test", underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] empty underStep_id : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post("/admin/underStep/modify").send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test", underStep_id: null, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] empty language : should not modify the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).post("/admin/underStep/modify").send({ token: "test", newUnderStep: newUnderStep, step_id: 1, stocked_title: "test", underStep_id: 1, language: "" });
            expect(response.statusCode).toBe(400);
        });
        test("[MODIFY] process doesn't exist : should not modify the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).post("/admin/underStep/modify").send({
                token: "test",
                newUnderStep: newUnderStep,
                step_id: 1,
                stocked_title: "test",
                underStep_id: 1,
                language: "english"
            });
            expect(response.statusCode).toBe(404);
        });
        test("[MODIFY] step doesn't exist : should not modify the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getById = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).post("/admin/underStep/modify").send({
                token: "test",
                newUnderStep: newUnderStep,
                step_id: 1,
                stocked_title: "test",
                underStep_id: 1,
                language: "english"
            });
            expect(response.statusCode).toBe(404);
        });
        test("[MODIFY] steps doesn't exist : should not modify the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getById = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getByProcess = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server).post("/admin/underStep/modify").send({
                token: "test",
                newUnderStep: newUnderStep,
                step_id: 1,
                stocked_title: "test",
                underStep_id: 1,
                language: "english"
            });
            expect(response.statusCode).toBe(404);
        });
        test("[MODIFY] system error : should not modify the step with a 500 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockRejectedValueOnce(new Error());

            const response = await request(server).post("/admin/underStep/modify").send({
                token: "test",
                newUnderStep: newUnderStep,
                step_id: 1,
                stocked_title: "test",
                underStep_id: 1,
                language: "english"
            });
            expect(response.statusCode).toBe(500);
        });
        test("[DELETE] missing token : should not delete the step with a 400 status code", async() => {
            const response = await request(server).get(`/admin/underStep/delete`).query({ stocked_title: "test", step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] unauthorized : should not delete the step with a 403 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(false);
            const response = await request(server).get(`/admin/underStep/delete`).query({ token: "test", stocked_title: "test", step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(403);
        });
        test("[DELETE] missing stocked_title : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get(`/admin/underStep/delete`).query({ token: "test", step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] missing step_id : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get(`/admin/underStep/delete`).query({ token: "test", stocked_title: "test", underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] missing underStep_id : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get(`/admin/underStep/delete`).query({ token: "test", stocked_title: "test", step_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] missing all : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get(`/admin/underStep/delete`);
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] empty all : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server).get(`/admin/underStep/delete`).query({ token: "", stocked_title: "", step_id: "", underStep_id: "", language: "" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] empty stocked_title : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server)
                .get(`/admin/underStep/delete`)
                .query({ token: "test", stocked_title: "", step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] empty step_id : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server)
                .get(`/admin/underStep/delete`)
                .query({ token: "test", stocked_title: "test", step_id: "", underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] empty underStep_id : should not delete the step with a 400 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            const response = await request(server)
                .get(`/admin/underStep/delete`)
                .query({ token: "test", stocked_title: "test", step_id: 1, underStep_id: "", language: "english" });
            expect(response.statusCode).toBe(400);
        });
        test("[DELETE] process doesn't exist : should not delete the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server)
                .get(`/admin/underStep/delete`)
                .query({ token: "test", stocked_title: "test", step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(404);
        });
        test("[DELETE] step doesn't exist : should not delete the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getById = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server)
                .get(`/admin/underStep/delete`)
                .query({ token: "test", stocked_title: "test", step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(404);
        });
        test("[DELETE] steps doesn't exist : should not delete the step with a 404 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getById = jest.fn().mockResolvedValueOnce({ id: 1 });
            Step.getByProcess = jest.fn().mockResolvedValueOnce(null);

            const response = await request(server)
                .get(`/admin/underStep/delete`)
                .query({ token: "test", stocked_title: "test", step_id: 1, underStep_id: 1, language: "english" });
            expect(response.statusCode).toBe(404);
        });
        test("[DELETE] system error : should not delete the step with a 500 status code", async() => {
            Users.isAdmin = jest.fn().mockReturnValue(true);
            Process.get = jest.fn().mockRejectedValueOnce(new Error());

            const response = await request(server)
                .get(`/admin/underStep/delete`)
                .query({ token: "test", stocked_title: "test", step_id: 1, underStep_id: 1 });
            expect(response.statusCode).toBe(500);
        });
    });
});