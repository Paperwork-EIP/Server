const Pool = require('../../src/persistence/db');

describe('Db Tests', () => {
    it('should have a max of 10', () => {
        expect(Pool.options.max).toBe(10);
    });

    it('should have a connectionString from the environment variable DATABASE_URL', () => {
        expect(Pool.options.connectionString).toBe(process.env.DATABASE_URL);
    });
});