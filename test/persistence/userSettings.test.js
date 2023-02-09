const db = require('../../src/persistence/db');
const UserSettings = require("../../src/persistence/userSettings");

afterEach(() => {
    jest.restoreAllMocks();
});

describe("User Settings Persistence Tests", () => {
    const user_id = 1;

    it('[CREATE] should create a new user settings', async () => {
        const result = {
            id: 1,
            user_id: user_id
        };
        const expectedResponse = {
            id: 1,
            user_id: user_id
        }
        db.query = jest.fn().mockReturnValue({ rows: [result] });
        const response = await UserSettings.create(user_id);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[CREATE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(UserSettings.create()).rejects.toThrow();
    });
    it("[DELETE] should delete a user setting", async () => {
        const data = {
            id: 1,
            user_id: user_id
        }
        db.query = jest.fn().mockReturnValue({ rows: [data] });
        const spy = jest.spyOn(db, "query");
        const response = await UserSettings.delete(user_id);

        expect(spy).toHaveBeenCalled();
        expect(response).not.toBeNull();
    });
    it('[DELETE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockResolvedValue(() => { new Error });
        await expect(UserSettings.delete()).rejects.toThrow();
    });
    it("[GET] should get a user setting", async () => {
        const data = {
            id: 1,
            user_id: user_id
        }
        db.query = jest.fn().mockReturnValue({ rows: [data] });
        const spy = jest.spyOn(db, "query");
        const response = await UserSettings.get(user_id);

        expect(spy).toHaveBeenCalled();
        expect(response).not.toBeNull();
    });
    it('[MODIFY SETTINGS] should modify a user settings', async () => {
        const data = 'night_mode';
        const value = true;
        const expectedResponse = {
            message: 'User settings modified !'
        }
        db.query = jest.fn().mockReturnValue({ rows: [expectedResponse] });
        const response = await UserSettings.modifySettings(user_id, data, value);

        expect(response).toEqual(expect.any(Object));
        expect(response).toEqual(expectedResponse);
        expect(db.query).toHaveBeenCalled();
    });
    it('[MODIFY SETTINGS] should return null if value is not define', async () => {
        const data = 'night_mode';
        const value = undefined;
        const expectedResponse = {
            message: 'User settings modified !'
        }
        db.query = jest.fn().mockReturnValue({ rows: [expectedResponse] });
        const response = await UserSettings.modifySettings(user_id, data, value);

        expect(response).toBeNull()
    });
    it('[MODIFY SETTINGS] should return null if data is unknown', async () => {
        const data = 'unknowdata';
        const value = true;
        const expectedResponse = {
            message: 'User settings modified !'
        }
        db.query = jest.fn().mockReturnValue({ rows: [expectedResponse] });
        const response = await UserSettings.modifySettings(user_id, data, value);

        expect(response).toBeNull()
    });
    it('[MODIFY SETTINGS] should throw an error if an error occurs', async () => {
        const data = 'night_mode';
        const value = true;

        jest.spyOn(db, 'query').mockReturnValue(() => { new Error });

        await expect(UserSettings.modifySettings(null, data, value)).rejects.toThrow();
    });
});
