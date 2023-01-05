const router = require("../index");
const { start, stop } = require("../index");

describe("Index tests", () => {
    const port = 3080;

    describe("[UNIT TESTS]", () => {
        describe("[VALID TESTS", () => {
            test("[index.js] should have a router component", () => {
                expect(router).not.toBeNull();
            });
            test("[index.js] should have instanced the router component", () => {
                expect(router).toBeDefined();
            });
            test("port existing : should start the server", async () => {
                let server = start(port);
                stop();

                expect(server).toBeDefined();
            });
        });
        describe("[INVALID TESTS]", () => {
            test("port missing : should start the server", async () => {
                let server = start();
                stop();

                expect(server).toBeNull();
            });
            test("port missing : should start the server", async () => {
                let server = start(0);
                stop();

                expect(server).toBeNull();
            });
        });
    });
});