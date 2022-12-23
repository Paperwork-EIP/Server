const request = require("supertest");
const router = require("../../src/api/db/user");
const { start, stop } = require('../../index');

describe("User connection tests", () => {
    const port = 3002;
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
        describe("[VALID REGISTER TESTS]", () => {
            test("should register an user with a 200 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "usernameeeeeeeeeeeeeeeeeeeeeeeeee",
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "password"
                });
                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID REGISTER TESTS]", () => {
            test("should register an user with a 409 status code(email)", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "lalalalalalalalalalalala",
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "password"
                });
                expect(response.statusCode).toBe(409);
            });
            test("should register an user with a 409 status code(username)", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "usernameeeeeeeeeeeeeeeeeeeeeeeeee",
                    email: "lalalalalalalalalalalala",
                    password: "password"
                });
                expect(response.statusCode).toBe(409);
            });
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
        describe("[VALID LOGIN TESTS]", () => {
            test("should login an user with a 200 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "password"
                });

                expect(response.statusCode).toBe(200);
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
            test("should login an user with a 404 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "lalalalalalalalalalalalala",
                    password: "lalalalalalalalalalalala"
                });

                expect(response.statusCode).toBe(404);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "lalalalalalalalalalalala"
                });
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 404 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=lllllllllllllllllllllllllllllllllllll").send({});
                
                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID GETBYUSERNAME TESTS]", () => {
            test("should get an user data with a 200 status code", async () => {
                const response = await request(server).get("/user/getbyusername?username=usernameeeeeeeeeeeeeeeeeeeeeeeeee").send({});
                
                expect(response.statusCode).toBe(200);
            });
        });
        describe("[VALID GETBYEMAIL TESTS]", () => {
            test("should get an user data with a 200 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=emaillllllllllllllllllllllllllllllll").send({});
                
                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID GETBYEMAIL TESTS]", () => {
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=").send({});
                
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyemail").send({});
                
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 404 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=lllllllllllllllllllllllllllllllllllll").send({});
                
                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID GETBYUSERNAME TESTS]", () => {
            test("should get an user data with a 200 status code", async () => {
                const response = await request(server).get("/user/getbyusername?username=usernameeeeeeeeeeeeeeeeeeeeeeeeee").send({});
                
                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID GETBYUSERNAME TESTS]", () => {
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyusername?username=").send({});
                
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyusername").send({});
                
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 404 status code", async () => {
                const response = await request(server).get("/user/getbyusername?username=lllllllllllllllllllllllllllll").send({});
                
                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID DELETE TESTS]", () => {
            test("should delete an user with a 200 status code", async () => {
                const response = await request(server).get("/user/delete?email=emaillllllllllllllllllllllllllllllll").send({});

                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID DELETE TESTS]", () => {
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete?email=").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should delete an user with a 404 status code", async () => {
                const response = await request(server).get("/user/delete?email=lalalalalllllllllllllllllll").send({});

                expect(response.statusCode).toBe(404);
            });
        });
    });
});