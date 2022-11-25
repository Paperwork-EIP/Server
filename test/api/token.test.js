const request = require("supertest");
const router = require("../../src/api/db/token");
const { start, stop } = require('../../index');

describe("Token tests", () => {
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
        // describe("[VALID TESTS]", () => {
        //     test("should set a token with the route '/set' (no database)", async () => {
        //         const response = await request(server).post("/token/set").send({
        //             service: "service",
        //             token: "ffuvdfbd6fv45v64",
        //             user: "username"
        //         });
    
        //         expect(response.statusCode).toBe(500);
        //     });
        //     test("should receive a token with the route '/get' (no database)", async () => {
        //         const response = await request(server).get("/token/get").send({
        //             service: "service",
        //             user: {
        //                 email: "test@test.com"
        //             }
        //         });
    
        //         expect(response.statusCode).toBe(500);
        //     });
        //     test("should receive a token with the route '/getAll' (no database)", async () => {
        //         const response = await request(server).get("/token/getAll").send({
        //             service: "service",
        //             user: {
        //                 email: "test@test.com"
        //             }
        //         });
    
        //         expect(response.statusCode).toBe(500);
        //     });
        // });
    
        // describe("[INVALID TESTS]", () => {
        //     test("service missing : should receive a token with the route '/get' (no database)", async () => {
        //         const response = await request(server).post("/token/set").send({
        //             service: "service",
        //             token: "ffuvdfbd6fv45v64",
        //             user: "username"
        //         });
    
        //         expect(response.statusCode).toBe(500);
        //     });
        // });
    });
});