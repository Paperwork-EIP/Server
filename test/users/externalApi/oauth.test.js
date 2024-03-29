const request = require("supertest");
const router = require("../../../src/routes/users/externalApi/oauth");
const { start, stop } = require('../../../index');

describe("OAuth connections tests", () => {
    const port = 3001;
    let server;

    beforeAll(async() => {
        server = await start(port);
    });

    afterAll(() => {
        stop();
    });

    describe("[UNIT TESTS]", () => {
        describe("[VALID OAUTH TESTS]", () => {
            test("should have a router component", () => {
                expect(router).not.toBeNull();
            });
            test("should have instanced the router component", () => {
                expect(router).toBeDefined();
            });
            describe("--- OAUTH GOOGLE ---", () => {
                test("'/urlLogin' should exist", async() => {
                    const payload = {};
                    const response = await request(server).get('/user/oauth/google/urlLogin').query(payload);

                    expect(response.notFound).toEqual(false);
                    expect(response.status).toBe(200);
                });
            });

            describe("--- OAUTH FACEBOOK ---", () => {
                test("'/url' should exist", async() => {
                    const payload = {};
                    const response = await request(server).get('/user/oauth/facebook/url').query(payload);

                    expect(response.notFound).toEqual(false);
                    expect(response.status).toBe(200);
                });
                test("'/' should exist", async() => {
                    const payload = {};
                    const response = await request(server).get('/user/oauth/facebook/').query(payload);

                    expect(response.notFound).toEqual(false);
                    expect(response.status).toBe(409);
                });
            });
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID OAUTH TESTS]", () => {
            describe("--- OAUTH GOOGLE ---", () => {
                test("should receive a valid response for route '/urlLogin'", async() => {
                    const payload = {};
                    const response = await request(server).get("/user/oauth/google/urlLogin").query(payload);

                    expect(response).not.toBeNull();
                    expect(response.status).toEqual(200);
                    expect(response.req.header).not.toBeNull();
                    expect(response.text).not.toBeNull();
                    expect(response.header).not.toBeNull();
                    expect(response.headers).not.toBeNull();
                    expect(response.header['content-type']).toEqual("text/html; charset=utf-8");
                    expect(response.headers['content-type']).toEqual("text/html; charset=utf-8");
                });
            });

            describe("--- OAUTH FACEBOOK ---", () => {
                test("should receive a valid response for route '/url'", async() => {
                    const payload = {};
                    const response = await request(server).get("/user/oauth/facebook/url").query(payload);

                    expect(response).not.toBeNull();
                    expect(response.status).toEqual(200);
                    expect(response.req.header).not.toBeNull();
                    expect(response.text).not.toBeNull();
                    expect(response.header).not.toBeNull();
                    expect(response.headers).not.toBeNull();
                    expect(response.header['content-type']).toEqual("text/html; charset=utf-8");
                    expect(response.headers['content-type']).toEqual("text/html; charset=utf-8");
                });
            });
        });

        describe("[INVALID OAUTH TESTS", () => {
            describe("--- OAUTH GOOGLE ---", () => {
                test("code empty : should receive an error 409 status code", async() => {
                    const response = await request(server).get("/user/oauth/google/login").query({
                        code: "",
                    });

                    expect(response.status).toBe(409);
                });

                test("id_token wrong : should receive an error 500 status code", async() => {
                    const response = await request(server).get("/user/oauth/google/login").query({
                        code: "fdsfdsgfbfdssbdfdfvdfvd"
                    });

                    expect(response.status).toBe(500);
                });
            });

            describe("--- OAUTH FACEBOOK ---", () => {
                test("code missing : should receive an error 409 status code", async() => {
                    const response = await request(server).get('/user/oauth/facebook/').query({});

                    expect(response.status).toBe(409);
                });
                test("code empty : should receive an error 409 status code", async() => {
                    const response = await request(server).get('/user/oauth/facebook/').query({
                        code: ""
                    });

                    expect(response.status).toBe(409);
                });
            });
        });
    });
});