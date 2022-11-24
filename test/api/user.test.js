const request = require("supertest");
const { start, stop } = require('../../index');

describe("User connection tests", () => {
    const port = 3001;
    let server;

    beforeAll(() => {
        server = start(port);
    });

    afterAll(() => {
        if (server) {
            stop();
        }
    });

    describe("[UNIT TEST]", () => {

    });

    describe("[INTEGRATION TEST]", () => {
        // describe("[VALID TESTS]", () => {
        //     test("should register an user with a 200 status code", async () => {
        //         const response = await request(route).post("/register").send({
        //             username: "username",
        //             email: "email",
        //             password: "password"
        //         });

        //         expect(response.statusCode).toBe(200);
        //     });
        // });
        describe("[INVALID TESTS]", () => {
            test("username missing : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    email: "email",
                    password: "password"
                });

                expect(response.status).toBe(400);
            });

            // test("email missing : should not register an user with a 400 status code", async () => {
            //     const response = request(route).post("/register").send({
            //         username: "username",
            //         password: "password"
            //     });

            //     expect(response.statusCode).toBe(400);
            // });

            // test("password missing : should not register an user with a 400 status code", async () => {
            //     const response = request(route).post("/register").send({
            //         username: "username",
            //         email: "email"
            //     });

            //     expect(response.statusCode).toBe(400);
            // });
        });
    });
});