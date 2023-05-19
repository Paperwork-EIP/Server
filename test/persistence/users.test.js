const db = require('../../src/persistence/db');
const sql = require('sql-template-strings');
const bcrypt = require('bcryptjs');
const User = require('../../src/persistence/users');
const init_db = require('../../src/persistence/init-db');
const { getById } = require('../../src/persistence/process');

beforeAll(async () => {
    await init_db.initAll();
});
afterEach(() => {
    jest.restoreAllMocks();
});

describe("User Persistence Tests", () => {
    it('[CREATE] should create a new user', async () => {
        const username = 'testUser';
        const email = 'test@example.com';
        const password = 'password';

        const response = await User.create(username, email, password);
        await db.query(sql`DELETE FROM user_table WHERE email=${email};`);

        expect(response).not.toBeNull();
        expect(response.id).toEqual(expect.any(Number));
        expect(response.email).toEqual(email);
    });
    it('[CREATE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockReturnValue(() => { new Error });
        await expect(User.create()).rejects.toThrow();
    });
    it('[FIND] should find a user by email', async () => {
        const username = 'testUser2';
        const email = 'test2@example.com';
        const password = 'password';
        const expectedResult = {
            username: username,
            email: email
        };

        await User.create(username, email, password);

        const response = await User.find(email);

        await db.query(sql`DELETE FROM user_table WHERE email=${email};`);

        expect(response).not.toBeNull();
        expect(response).toEqual(expectedResult);
    });
    it('[FIND] should find a user by username', async () => {
        const username = 'testUser2';
        const email = 'test2@example.com';
        const password = 'password';
        const expectedResult = {
            username: username,
            email: email
        };

        await User.create(username, email, password);

        const response = await User.findUsername(username);

        await db.query(sql`DELETE FROM user_table WHERE email=${email};`);

        expect(response).not.toBeNull();
        expect(response).toEqual(expectedResult);
    });
    it('[GETBYID] should return the user datas or an empty result', async () => {    
        db.query = jest.fn().mockReturnValue({ rows: [{ id: 567 }] });
    
        const response = await User.getById(567);
        expect(response).toEqual({ id: 567 });
    });
    it('[DELETE] should delete a user from the user_table', async () => {
        const email = 'test@example.com';

        const mockQuery = jest.fn().mockReturnValue({ rows: [{ email }] });
        db.query = mockQuery;

        const result = await User.delete(email);

        expect(result).toEqual({ email });
    });

    it('[DELETE] should throw an error if the query fails', async () => {
        const errorMessage = 'Error deleting user';

        db.query = jest.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await User.delete();
            fail();
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }
    });
    it('[DELETE] should throw an error if an error occurs', async () => {
        jest.spyOn(db, 'query').mockReturnValue(() => { new Error });
        await expect(User.delete()).rejects.toThrow();
    });
    it('[MODIFY DATA] should do nothing.', async () => {
        const email = 'test@blablabla.com';
        const data = 'email';
        const result = await User.modifyDatas(email, data);

        expect(result).undefined;
    });
    it('[MODIFY DATA] should update user data when data is email', async () => {
        const email = 'test@blablabla.com';
        const value = 'newemail@cool.conm';
        const data = 'email';

        db.query = jest.fn().mockReturnValue({ rows: [{ email: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ email: value });
    });
    it('[MODIFY DATA] should update user data when data is language', async () => {
        const email = 'test@blablabla.com';
        const value = 'english';
        const data = 'language';

        db.query = jest.fn().mockReturnValue({ rows: [{ language: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ language: value });
    });
    it('[MODIFY DATA] should update user data when data is username', async () => {
        const email = 'test@blablabla.com';
        const value = 'testUsername';
        const data = 'username';

        db.query = jest.fn().mockReturnValue({ rows: [{ username: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ username: value });
    });
    it('[MODIFY DATA] should update user data when data is firstname', async () => {
        const email = 'test@blablabla.com';
        const value = 'John';
        const data = 'firstname';

        db.query = jest.fn().mockReturnValue({ rows: [{ firstname: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ firstname: value });
    });
    it('[MODIFY DATA] should update user data when data is name', async () => {
        const email = 'test@blablabla.com';
        const value = 'Doe';
        const data = 'name';

        db.query = jest.fn().mockReturnValue({ rows: [{ name: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ name: value });
    });
    it('[MODIFY DATA] should update user data when data is age', async () => {
        const email = 'test@blablabla.com';
        const value = 13;
        const data = 'age';

        db.query = jest.fn().mockReturnValue({ rows: [{ age: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ age: value });
    });
    it('[MODIFY DATA] should update user data when data is adress', async () => {
        const email = 'test@blablabla.com';
        const value = 'adress';
        const data = 'adress';

        db.query = jest.fn().mockReturnValue({ rows: [{ adress: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ adress: value });
    });
    it('[MODIFY DATA] should update user data when data is number_phone', async () => {
        const email = 'test@blablabla.com';
        const value = '00 00 00 00 00';
        const data = 'number_phone';

        db.query = jest.fn().mockReturnValue({ rows: [{ number_phone: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ number_phone: value });
    });
    it('[MODIFY DATA] should update user data when data is profile_picture', async () => {
        const email = 'test@blablabla.com';
        const value = 'url';
        const data = 'profile_picture';

        db.query = jest.fn().mockReturnValue({ rows: [{ profile_picture: value }] });
        const result = await User.modifyDatas(email, data, value);

        expect(result).toEqual({ profile_picture: value });
    });
    it('[MODIFY DATA] should update user data when data is password', async () => {
        const email = 'test@blablabla.com';
        const value = 'vyjhbhk';
        const data = 'password';

        db.query = jest.fn().mockReturnValue({ rows: [{ password: value }] });

        const spy = jest.spyOn(bcrypt, 'hash');
        const result = await User.modifyDatas(email, data, value);

        expect(spy).toHaveBeenCalled();
        expect(result).toEqual({ password: value });
    });
    it('[MODIFY DATA] should throw an error if an error occurs', async () => {
        const email = 'test@blablabla.com';
        const value = 'fsfghseruogsregfhsbreuf';
        const data = 'password';

        jest.spyOn(db, 'query').mockReturnValue(() => { new Error });
        await expect(User.modifyDatas(email, data, value)).rejects.toThrow();
    });
    it('[SET TOKEN] should throw an error if the query fails', async () => {
        const errorMessage = 'Error setting token';

        db.query = jest.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await User.setToken();
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }
    });
    it('[FIND TOKEN] should return the user datas or an empty result', async () => {    
        db.query = jest.fn().mockReturnValue({ rows: [{ token: "lalalalal" }] });
    
        const response = await User.findToken("lalalalal");
        expect(response).toEqual({ token: "lalalalal" });
    });
    it('[SET EMAIL VERIFIED] should set the user email_verified on true', async () => {
        db.query = jest.fn().mockReturnValue({ rows: [{ email_verified: true }] });

        const response = await User.setEmailVerified('1234', true);
        expect(response).toEqual({ email_verified: true });
        expect(response).not.toBeNull();
    });
    it('[SET EMAIL VERIFIED] should throw an error if the query fails', async () => {
        const errorMessage = 'Error setting email_verified';

        db.query = jest.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await User.setEmailVerified('1234', true);
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }
    });
    it('[SET PASSWORD] should return the user datas or an empty result', async () => {
        db.query = jest.fn().mockReturnValue({ rows: [{ password: "lalalalal" }] });

        const response = await User.setPassword("lalala", "lalalalal");
        expect(response).toEqual({ password: "lalalalal" });
    });
    it('[SET PASSWORD] should throw an error if the query fails', async () => {
        const errorMessage = 'Error setting password';

        db.query = jest.fn().mockRejectedValue(new Error(errorMessage));

        try {
            await User.setPassword("lalala", "lalalalal");
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }
    });
});