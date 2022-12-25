const request = require("supertest");
const router = require("../../src/process/index");
const { start, stop } = require("../../index");

describe("Process test", () => {
    const port = 3003;
    let server;

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
        describe("[VALID ADD PROCESS TESTS]", () => {
            test("should create and add a process in the database with a 200 status code", async () => {
                const response = await request(server).post("/process/add").send({
                    title: "Test",
                    description: "This is a test",
                    source: "https://google.com",
                    delay: null
                });
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
            test("should delete a process with a 200 status code", async () => {
                const response = await request(server).get("/process/delete").query({
                    title: "Test"
                });
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID ADD PROCESS TESTS]", () => {
            test("title missing : should not create a process with a 400 status code", async () => {
                const response = await request(server).post("/process/add").send({
                    description: "This is a test"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("title empty : should not create a process with a 400 status code", async () => {
                const response = await request(server).post("/process/add").send({
                    title: "",
                    description: "This is a test"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("describe missing : should not create a process with a 400 status code", async () => {
                const response = await request(server).post("/process/add").send({
                    title: "Test"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("describe empty : should not create a process with a 400 status code", async () => {
                const response = await request(server).post("/process/add").send({
                    title: "Test",
                    description: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID DELETE TESTS]", () => {
            test("title missing : should not delete a process with a 400 status code", async () => {
                const response = await request(server).get("/process/delete").query({ });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("title empty : should not delete a process with a 400 status code", async () => {
                const response = await request(server).get("/process/delete").query({
                    title: ""
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should not delete a process with a 404 status code", async () => {
                const response = await request(server).get("/process/delete").query({
                    title: "123456"
                });
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
    });
});