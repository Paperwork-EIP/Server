const request = require("supertest");
const { start, stop } = require('../../index');

describe("OAuth connections tests", () => {
    const port = 3002;
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
        describe("[VALID OAUTH TESTS]", () => {
            describe("--- OAUTH GOOGLE ---", () => {
                test("should receive a valid response", async () => {
                    const response = await request(server).get("/oauth/google/urlLogin").send({});

                    expect(response).not.toBeNull();
                });
            });

            describe("--- OAUTH FACEBOOK ---", () => {
                test("should receive a valid response", async () => {
                    const response = await request(server).get("/oauth/facebook/url").send({});

                    expect(response).not.toBeNull();
                });
            });
        });

        describe("[INVALID OAUTH TESTS", () => {
            describe("OAUTH GOOGLE", () => {

            });

            describe("OAUTH FACEBOOK", () => {

            });
        });
    });
});