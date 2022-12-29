const request = require("supertest");
const router = require("../../src/process/index");
const routerUserProcess = require("../../src/process/userProcess");
const { start, stop } = require("../../index");

describe("User process", () => {
    const port = 3006;
    let server;

    beforeAll(() => {
        server = start(port);
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
            expect(routerUserProcess).not.toBeNull();
        });
        test("[process.js] should have instanced the router component", () => {
            expect(routerUserProcess).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS", () => {
        describe("[VALID USER PROCESS TESTS]", () => {

        });
        describe("[INVALID USER PROCESS TESTS]", () => {
            
        });
    });
});