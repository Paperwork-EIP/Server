const Pool = require('../../src/persistence/db');
const init_db = require('../../src/persistence/init-db');

beforeAll(async () => {
    await init_db.initAll();
});

describe('Db Tests', () => {
    it('should have a max of 10', () => {
        expect(Pool.options.max).toBe(10);
    });

    it('should have a connectionString from the environment variable DATABASE_URL', () => {
        expect(Pool.options.connectionString).toBe(process.env.DATABASE_URL);
    });
});