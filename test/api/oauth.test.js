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
        describe("[VALID OAUTH TESTS]", () => {
            describe("--- OAUTH GOOGLE ---", () => {
                test("'/' should exist", async () => {
                    const payload = {};
                    const response = await request(server).get('/oauth/google/urlLogin').send(payload);

                    expect(response.notFound).toEqual(false);
                });
            });

            describe("--- OAUTH FACEBOOK ---", () => {
                test("'/' should exist", async () => {
                    const payload = {};
                    const response = await request(server).get('/oauth/facebook/url').send(payload);

                    expect(response.notFound).toEqual(false);
                });
            });
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID OAUTH TESTS]", () => {
            // test("should receive a valid response", async () => {
            //     const payload = {
            //         query: {
            //             code: "dkgfbfddbfb"
            //         }
            //     };
            //     const response = await request(server).get("/oauth/google/").send(payload);
                
            //     expect(response).not.toBeNull()
            //     expect(response.status).toEqual(200);
            //     expect(response.req.header).not.toBeNull();
            //     expect(response.text).not.toBeNull();
            //     expect(response.header).not.toBeNull();
            //     expect(response.headers).not.toBeNull();
            //     expect(response.header['content-type']).toEqual("text/html; charset=utf-8");
            //     expect(response.headers['content-type']).toEqual("text/html; charset=utf-8");
            // });
            describe("--- OAUTH GOOGLE ---", () => {
                test("should receive a valid response", async () => {
                    const payload = {};
                    const response = await request(server).get("/oauth/google/urlLogin").send(payload);

                    expect(response).not.toBeNull()
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
                test("should receive a valid response", async () => {
                    const payload = {};
                    const response = await request(server).get("/oauth/facebook/url").send(payload);

                    expect(response).not.toBeNull()
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
            describe("--- LOGIN ---", () => {
                // test("should return an error for route '/' with an 400 status code", async () => {
                //     const response = await request(server).get("/oauth/google/").send({});
    
                //     expect(response.status).toBe(400);
                // });
                // test("id_token missing : should receive an error 400 status code", async () => {
                //     const response = await request(server).get("/oauth/google/login").send({
                //         access_token: "fdsfdsgfbfdssbdfdfvdfvd"
                //     });
    
                //     expect(response.status).toBe(400);
                // });
                // test("id_token empty : should receive an error 400 status code", async () => {
                //     const response = await request(server).get("/oauth/google/login").send({
                //         id_token: "",
                //         access_token: "fdsfdsgfbfdssbdfdfvdfvd"
                //     });
    
                //     expect(response.status).toBe(400);
                // });
                // test("access_token missing : should receive an error 400 status code", async () => {
                //     const payload = {
                //         id_token: "fdsfdsgfbfdssbdfdfvdfvd"
                //     };
                //     const response = await request(server).get("/oauth/google/login").send(payload);
    
                //     expect(response.status).toBe(400);
                //     expect(response).toBeCalledWith(payload);
                // });
                // test("access_token empty : should receive an error 400 status code", async () => {
                //     const response = await request(server).get("/oauth/google/login").send({
                //         id_token: "fdsfdsgfbfdssbdfdfvdfvd",
                //         access_token: ""
                //     });
    
                //     expect(response.status).toBe(400);
                // });
            });
            describe("--- OAUTH GOOGLE ---", () => {

            });

            describe("--- OAUTH FACEBOOK ---", () => {

            });
        });
    });
});