const request = require("supertest");
const router = require("../../src/process/index");
const { start, stop } = require("../../index");

describe("Steps tests", () => {
    const port = 3005;
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
        
    });
});