const router = require("../index");
const bodyParser = require('body-parser');
const route = require('../src/api/index');
const { start, stop } = require("../index");

describe("Index tests", () => {
    const port = 3080;
    const corsOptions = {
        origin: '*'
    };

    describe("[UNIT TESTS]", () => {
        describe("[VALID TESTS]", () => {
            it('should use body parser middleware', () => {
                expect(bodyParser.json()).toBeDefined();
            });

            it('should use route and process middleware', () => {
                expect(route).toBeDefined();
            });
            it("should have a router component", () => {
                expect(router).not.toBeNull();
            });
            it("should have instanced the router component", () => {
                expect(router).toBeDefined();
            });
            it("port existing : should start the server", async () => {
                let server = start(port);

                expect(server).toBeDefined();
            });
        });
        describe("[INVALID TESTS]", () => {
            it("port missing : should not start the server", async () => {
                let server = start();
                stop();

                expect(server).toBeNull();
            });
            it("port missing : should not start the server", async () => {
                let server = start(0);
                stop();

                expect(server).toBeNull();
            });
        });
    });
});