const request = require("supertest");
const router = require("../../src/process/index");
const routerProposal = require("../../src/process/processProposal");
const { start, stop } = require("../../index");

describe("Process proposal tests", () => {
    const port = 3010;
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
        test("[questions.js] should have a router component", () => {
            expect(routerProposal).not.toBeNull();
        });
        test("[questions.js] should have instanced the router component", () => {
            expect(routerProposal).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS] add", () => {
        describe("[VALID TESTS] Process proposal", () => {
            test("[ADD] should add a process proposal with a 200 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: "ttttttttttttttttttttttttttttttt",
                    username: "mmmmmmmmmmmmmmmmmmmmmmmmmmmm",
                    password: "ppppppppppppppppppppppppppppppp"
                });
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "TestContent",
                    user_email: "ttttttttttttttttttttttttttttttt"
                });
                const proposal = JSON.parse(response.text);
                const del = await request(server).get("/processProposal/delete").query({
                    id: proposal.response.id
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: "ttttttttttttttttttttttttttttttt"
                });
                expect(register.statusCode).toBe(200);
                expect(register.message).not.toBeNull();
                expect(register.response).not.toBeNull();
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
                expect(del.statusCode).toBe(200);
                expect(del.message).not.toBeNull();
                expect(del.response).not.toBeNull();
                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
            test("[GETALL] should get all the process proposal with a 200 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: "lllllllllllllllllllllllll",
                    username: "nnnnnnnnnnnnnnnnnnnnnnnnn",
                    password: "ppppppppppppppppppppppppppppppp"
                });
                const addProposal = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "TestContent",
                    user_email: "lllllllllllllllllllllllll"
                });
                const proposal = JSON.parse(addProposal.text);
                const response = await request(server).get("/processProposal/getAll").query({
                });
                const del = await request(server).get("/processProposal/delete").query({
                    id: proposal.response.id
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: "lllllllllllllllllllllllll"
                });
                expect(register.statusCode).toBe(200);
                expect(register.message).not.toBeNull();
                expect(register.response).not.toBeNull();
                expect(addProposal.statusCode).toBe(200);
                expect(addProposal.message).not.toBeNull();
                expect(addProposal.response).not.toBeNull();
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
                expect(del.statusCode).toBe(200);
                expect(del.message).not.toBeNull();
                expect(del.response).not.toBeNull();
                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
            test("[DELETE] should delete a process proposal with a 200 status code", async () => {
                const register = await request(server).post("/user/register").send({
                    email: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
                    username: "jjjjjjjjjjjjjjjjjjjjjjjjjjj",
                    password: "ppppppppppppppppppppppppppppppp"
                });
                const addProposal = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "TestContent",
                    user_email: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
                });
                const proposal = JSON.parse(addProposal.text);
                const del = await request(server).get("/processProposal/delete").query({
                    id: proposal.response.id
                });
                const deleteUser = await request(server).get("/user/delete").query({
                    email: "hhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
                });
                expect(register.statusCode).toBe(200);
                expect(register.message).not.toBeNull();
                expect(register.response).not.toBeNull();
                expect(addProposal.statusCode).toBe(200);
                expect(addProposal.message).not.toBeNull();
                expect(addProposal.response).not.toBeNull();
                expect(del.statusCode).toBe(200);
                expect(del.message).not.toBeNull();
                expect(del.response).not.toBeNull();
                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
        });
        describe("[INVALID TESTS]", () => {
            test("[ADD] should not add a process proposal with a 404 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "TestContent",
                    user_email: "ttttdgdhdjsksksllcjcjhdhcjedjke"
                });
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    content: "TestContent",
                    user_email: ""
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
                    user_email: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    description: "TestDescription",
                    user_email: "hsjskskskskssllslslssll"
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
                    user_email: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    title: "TestTitle",
                    content: "TestContent",
                    user_email: "hsjskskskskssllslslssll"
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
                    user_email: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
            test("[ADD] should not add a process proposal with a 400 status code", async () => {
                const response = await request(server).post("/processProposal/add").send({
                    description: "TestDescription",
                    content: "TestContent",
                    user_email: "hsjskskskskssllslslssll"
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
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
                const response = await request(server).get("/processProposal/delete").query({
                    id: 4294967
                });
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
                expect(response.response).not.toBeNull();
            });
        });
    });
});