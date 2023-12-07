const db = require('../../../src/persistence/db');
const Tokens = require('../../../src/persistence/users/tokens');
const init_db = require('../../../src/persistence/init-db');

beforeAll(async () => {
    await init_db.initAll();
});
afterEach(() => {
    jest.restoreAllMocks();
});

describe("Tokens Persistence Tests", () => {
    const email = "test@test.comdqdqsdd";
    const service = "gogogle";
    const token = "dsgsdfgdgg";

    it('[SET] should set a new token', async () => {
        const result = {
            token: "lolololololo"
        }

        db.query = jest.fn().mockResolvedValue({ rows: [result] });
        await Tokens.set(email, service, token);

        expect(db.query).toHaveBeenCalled();
    });
    it('[SET] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockRejectedValueOnce(() => { throw new Error });
        await expect(Tokens.set()).rejects.toThrow();
    });
    it('[FIND] should find a token', async () => {
        const token = "fksnghdgihsdg";
        const result = {
            [`${service}`]: token,
        }
        const expectedResponse = token;

        db.query = jest.fn().mockResolvedValue({ rows: [result] });
        const response = await Tokens.find(email, service);
       
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[FIND ALL] should find all token', async () => {
        const token = "fksnghdgihsdg";
        const result = {
            id: 123,
            email: 'test@example.com',
            password: 'hashed_password',
            tokens: [
                token,
                token
            ],
        }
        const expectedResponse = result;

        db.query = jest.fn().mockResolvedValue({ rows: [result] });
        const response = await Tokens.findAll(email);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
});
