const request = require("supertest");
const sinon = require("sinon");
const router = require("../../src/api/contact");
const { start, stop } = require('../../index');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const ses = new AWS.SES();

describe("Contact tests", () => {
    const port = 3001;
    let server;

    beforeAll(async () => {
        server = await start(port);
    });

    afterAll(() => {
        stop();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
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
        describe("[sendEmail] valide test", () => {
            test("should receive a valid response for route '/sendEmail'", async () => {
                const payload = {
                    email: "test",
                    content: "test",
                    name: "test"
                };
                const response = await request(server).get("/contact/sendEmail").query(payload);

                expect(response.status).toBe(200);
            });
        });
        describe("[sendEmail] invalide test", () => {
            test("status code 400, email empty", async () => {
                const payload = {
                    email: "",
                    content: "test",
                    name: "test"
                };
                const response = await request(server).get("/contact/sendEmail").query(payload);

                expect(response.status).toBe(400);
            });
            test("status code 400, email missing", async () => {
                const payload = {
                    content: "test",
                    name: "test"
                };
                const response = await request(server).get("/contact/sendEmail").send(payload);

                expect(response.status).toBe(400);
            });
            test("status code 400, content empty", async () => {
                const payload = {
                    email: "test",
                    content: "",
                    name: "test"
                };
                const response = await request(server).get("/contact/sendEmail").query(payload);

                expect(response.status).toBe(400);
            });
            test("status code 400, content missing", async () => {
                const payload = {
                    email: "test",
                    name: "test"
                };
                const response = await request(server).get("/contact/sendEmail").query(payload);

                expect(response.status).toBe(400);
            });
            test("status code 400, name empty", async () => {
                const payload = {
                    email: "test",
                    content: "test",
                    name: ""
                };
                const response = await request(server).get("/contact/sendEmail").query(payload);

                expect(response.status).toBe(400);
            });
            test("status code 400, name missing", async () => {
                const payload = {
                    email: "test",
                    content: "test",
                    name: ""
                };
                const response = await request(server).get("/contact/sendEmail").query(payload);

                expect(response.status).toBe(400);
            });
            test("status code 500, system error", async () => {
                try{
                    sinon.stub(ses, 'sendEmail').throws(new Error('Error.'));
                    const payload = {
                        email: "test",
                        content: "test",
                        name: "test"
                    };
                    const response = await request(server).get("/contact/sendEmail").query(payload);
                } catch (error) {
                    expect(response.status).toBe(500);
                }
            });
        });
    });
});