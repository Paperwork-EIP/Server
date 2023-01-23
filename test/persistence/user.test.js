const db = require('../../src/persistence/db');
const sql = require('sql-template-strings');
const User = require('../../src/persistence/users');

describe("Step Persistence Tests", () => {
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

  it('[FIND] should find a user by email', async () => {
    const username = 'testUser2';
    const email = 'test2@example.com';
    const password = 'password';
    const expectedResult = {
      id: expect.any(Number),
      username: username,
      email: email,
      password: expect.any(String),
      language: null,
      name: null,
      firstname: null,
      adress: null,
      profile_picture: null,
      age: null,
      number_phone: null,
      google_token: null,
      facebook_token: null
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
      id: expect.any(Number),
      username: username,
      email: email,
      password: expect.any(String),
      language: null,
      name: null,
      firstname: null,
      adress: null,
      profile_picture: null,
      age: null,
      number_phone: null,
      google_token: null,
      facebook_token: null
    };

    await User.create(username, email, password);

    const response = await User.findUsername(username);

    await db.query(sql`DELETE FROM user_table WHERE email=${email};`);

    expect(response).not.toBeNull();
    expect(response).toEqual(expectedResult);
  });
  // it('[CONNECT] should return valid code when email and password are correct', async () => {
  //     const email = 'test@example.com';
  //     const password = 'password';
  //     const expectedResult = { code: 'valid', user: { id: 1, email: 'test@example.com' } };

  //     const response = await User.connect(email, password);

  //     expect(response).toEqual(expectedResult);
  // });

  // it('[CONNECT] should return invalid code when email is correct but password is incorrect', async () => {
  //     const email = 'test@example.com';
  //     const password = 'incorrectPassword';
  //     const expectedResult = { code: 'invalid', user: { id: -1, email: '' } };

  //     const response = await User.connect(email, password);

  //     expect(response).toEqual(expectedResult);
  // });

  // it('[CONNECT] should return no email code when the given email does not exist in the database', async () => {
  //     const email = 'notExistingEmail@example.com';
  //     const password = 'password';
  //     const expectedResult = { code: 'no email', user: { id: -1, email: '' } };

  //     const response = await User.connect(email, password);

  //     expect(response).toEqual(expectedResult);
  // });
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
});