const db = require("../../src/persistence/init-db");

describe("Init db tests", () => {
    describe("[UNIT TESTS]", () => {
        describe("[VALID TESTS", () => {
            test("[init-db.js] should have a db component", () => {
                expect(db.initAll()).not.toBeNull();
            });
        });
    });
});