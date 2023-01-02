const request = require("supertest");
const router = require("../../src/process/index");
const routerUserProcess = require("../../src/process/userProcess");
const { start, stop } = require("../../index");

describe("User process", () => {
    const port = 3006;
    let server;

    beforeAll(async () => {
        server = start(port);
    });

    afterAll(async () => {
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
            expect(routerUserProcess).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", () => {
            expect(routerUserProcess).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS", () => {
        describe("[VALID USER PROCESS TESTS]", () => {
            // test("[ADD] should add a user process with a 200 status code", async () => {
            //     const response = await request(server).post("/userProcess/add").send({
            //         user_email: "test@test.com",
            //         process_title: "Test",
            //         questions: []
            //     }));
                
            //     expect(response.statusCode).toBe(200);
            //     expect(response.response).not.toBeNull();
            // });
        });
        describe("[INVALID USER PROCESS TESTS]", () => {
            test("[ADD] user email missing : should add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    process_title: "Test",
                    questions: []
                });
                
                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] user email empty : should add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "",
                    process_title: "Test",
                    questions: []
                });
                
                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process title missing : should add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    questions: []
                });
                
                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] process title empty : should add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    process_title: "",
                    questions: []
                });
                
                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] questions missing : should add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    process_title: "Test"
                });
                
                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
            test("[ADD] questions empty : should add a user process with a 400 status code", async () => {
                const response = await request(server).post("/userProcess/add").send({
                    user_email: "test@test.com",
                    process_title: "Test",
                    questions: null
                });
                
                expect(response.statusCode).toBe(400);
                expect(response.response).not.toBeNull();
            });
        });
    });
});