const request = require("supertest");
const { start, stop } = require('../../index');

describe("User connection tests", () => {
    const port = 3001;
    let server;

    beforeAll(() => {
        server = start(port);
    });

    afterAll(() => {
        stop();
    });

    describe("[UNIT TESTS]", () => {

    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID REGISTER TESTS]", () => {
            test("should register an user with a 500 status code (no database)", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    email: "email",
                    password: "password"
                });

                expect(response.statusCode).toBe(500);
            });
        });
        describe("[INVALID REGISTER TESTS]", () => {
            test("username missing : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    email: "email",
                    password: "password"
                });

                expect(response.status).toBe(400);
            });

            test("username empty : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "",
                    email: "email",
                    password: "password"
                });

                expect(response.status).toBe(400);
            });

            test("email missing : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });

            test("email empty : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    email: "",
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });

            test("password missing : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    email: "email"
                });

                expect(response.statusCode).toBe(400);
            });

            test("password empty : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    email: "email",
                    password: ""
                });

                expect(response.statusCode).toBe(400);
            });
        });
        describe("[INVALID LOGIN TESTS]", () => {
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "email"
                });

                expect(response.statusCode).toBe(400);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "",
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "email",
                    password: ""
                });

                expect(response.statusCode).toBe(400);
            });
        });
        describe("[INVALID GETBYEMAIL TESTS]", () => {
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyemail").send({
                    email: ""
                });

                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyemail").send({});

                expect(response.statusCode).toBe(400);
            });
        });
        describe("[INVALID GETBYUSERNAME TESTS]", () => {
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyusername").send({
                    username: ""
                });

                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyusername").send({});

                expect(response.statusCode).toBe(400);
            });
        });
        describe("[INVALID DELETE TESTS]", () => {
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete").send({
                    email: ""
                });

                expect(response.statusCode).toBe(400);
            });
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete").send({});

                expect(response.statusCode).toBe(400);
            });
        });
    });
});