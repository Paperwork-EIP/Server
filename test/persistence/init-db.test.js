const initdb = require("../../src/persistence/init-db");
const db = require('../../src/persistence/db');
const sql = require('sql-template-strings');
const sinon = require("sinon");

afterAll(() => {
    sinon.restore();
});

describe("Init db tests", () => {
    it("should have a db component", () => {
        expect(initdb.initAll()).not.toBeNull();
    });
    it('should create all the tables in the database', async () => {
        initdb.initAll();

        const userTableExists = await db.query(sql`SELECT * FROM user_table`);
        expect(userTableExists).toBeTruthy();

        const roleTableExists = await db.query(sql`SELECT * FROM role`);
        expect(roleTableExists).toBeTruthy();

        const userProcessTableExists = await db.query(sql`SELECT * FROM user_process`);
        expect(userProcessTableExists).toBeTruthy();

        const stepTableExists = await db.query(sql`SELECT * FROM step`);
        expect(stepTableExists).toBeTruthy();

        const userStepTableExists = await db.query(sql`SELECT * FROM user_step`);
        expect(userStepTableExists).toBeTruthy();

        const reportTableExists = await db.query(sql`SELECT * FROM report`);
        expect(reportTableExists).toBeTruthy();

        const processProposalTableExists = await db.query(sql`SELECT * FROM process_proposal`);
        expect(processProposalTableExists).toBeTruthy();

        const processTableExists = await db.query(sql`SELECT * FROM process`);
        expect(processTableExists).toBeTruthy();

        const postsTableExists = await db.query(sql`SELECT * FROM posts`);
        expect(postsTableExists).toBeTruthy();

        const comsTablesExist = await db.query(sql` SELECT*FROM coms `);
        expect(comsTablesExist).toBeTruthy();
    });
    test("[initAll] should throw an error if error occurs", async () => {
        let response;
        sinon.stub(db, 'query').throws(new Error('db query failed'));

        response = await initdb.initAll();
        expect(response).not.toBeNull();
    });
});