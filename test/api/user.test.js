const request = require("supertest");
const sinon = require("sinon");
const router = require("../../src/api/db/user");
const { start, stop } = require('../../index');
const User = require('../../src/persistence/users');
const Settings = require('../../src/persistence/userSettings');

describe("User connection tests", () => {
    const port = 3002;
    let server;

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
    });

    beforeAll(() => {
        server = start(port);
    });
    afterAll(() => {
        stop();
    });

    describe("[UNIT TESTS]", () => {
        test("should have a router component", () => {
            expect(router).not.toBeNull();
        });
        test("should have instanced the router component", () => {
            expect(router).toBeDefined();
        });
    });

    describe("[INTEGRATION TESTS]", () => {
        describe("[VALID REGISTER TESTS]", () => {
            test("should register an user with a 200 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "usernameeeeeeeeeeeeeeeeeeeeeeeeee",
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "password"
                });
                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID REGISTER TESTS]", () => {
            test("should register an user with a 409 status code(email)", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "lalalalalalalalalalalala",
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "password"
                });
                expect(response.statusCode).toBe(409);
            });
            test("should register an user with a 409 status code(username)", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "usernameeeeeeeeeeeeeeeeeeeeeeeeee",
                    email: "lalalalalalalalalalalala",
                    password: "password"
                });
                expect(response.statusCode).toBe(409);
            });
            test("username missing : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    email: "email",
                    password: "password"
                });

                expect(response.status).toBe(400);
            });

            test("username empty : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "",
                    email: "email",
                    password: "password"
                });

                expect(response.status).toBe(400);
            });

            test("email missing : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });

            test("email empty : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    email: "",
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });

            test("password missing : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    email: "email"
                });

                expect(response.statusCode).toBe(400);
            });
            test("password empty : should not register an user with a 400 status code", async () => {
                const response = await request(server).post("/user/register").send({
                    username: "username",
                    email: "email",
                    password: ""
                });

                expect(response.statusCode).toBe(400);
            });
        });
        describe("[VALID LOGIN TESTS]", () => {
            test("should login an user with a 200 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "password"
                });

                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID LOGIN TESTS]", () => {
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "email"
                });

                expect(response.statusCode).toBe(400);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "",
                    password: "password"
                });

                expect(response.statusCode).toBe(400);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "email",
                    password: ""
                });

                expect(response.statusCode).toBe(400);
            });
            test("should login an user with a 404 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "lalalalalalalalalalalalala",
                    password: "lalalalalalalalalalalala"
                });

                expect(response.statusCode).toBe(404);
            });
            test("should login an user with a 400 status code", async () => {
                const response = await request(server).post("/user/login").send({
                    email: "emaillllllllllllllllllllllllllllllll",
                    password: "lalalalalalalalalalalala"
                });
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 404 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=lllllllllllllllllllllllllllllllllllll").send({});

                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID GETBYEMAIL TESTS]", () => {
            test("should get an user data with a 200 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=emaillllllllllllllllllllllllllllllll").send({});

                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID GETBYEMAIL TESTS]", () => {
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyemail").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 404 status code", async () => {
                const response = await request(server).get("/user/getbyemail?email=lllllllllllllllllllllllllllllllllllll").send({});

                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID GETBYUSERNAME TESTS]", () => {
            test("should get an user data with a 200 status code", async () => {
                const response = await request(server).get("/user/getbyusername?username=usernameeeeeeeeeeeeeeeeeeeeeeeeee").send({});

                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID GETBYUSERNAME TESTS]", () => {
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyusername?username=").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbyusername").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 404 status code", async () => {
                const response = await request(server).get("/user/getbyusername?username=lllllllllllllllllllllllllllll").send({});

                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID GETBYTOKEN TESTS]", () => {
            test("should get an user data with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ email: "email" });
                const response = await request(server).get("/user/getbytoken?token=test").send({});
                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID GETBYTOKEN TESTS]", () => {
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbytoken?token=").send({});
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 400 status code", async () => {
                const response = await request(server).get("/user/getbytoken").send({});
                expect(response.statusCode).toBe(400);
            });
            test("should get an user data with a 404 status code", async () => {
                const response = await request(server).get("/user/getbytoken?token=lllll").send({});
                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID DELETE TESTS]", () => {
            test("should delete an user with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ email: "emaillllllllllllllllllllllllllllllll" });
                Settings.delete = jest.fn().mockReturnValue({ id: 1 });
                const response = await request(server).get("/user/delete?token=test").send({});

                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID DELETE TESTS]", () => {
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete?token=").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should delete an user with a 404 status code", async () => {
                const response = await request(server).get("/user/delete?token=lalalalalllllllllllllllllll").send({});

                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ email: "emaillllllllllllllllllllllllllllllll" });
                Settings.get = jest.fn().mockReturnValue({ id: 1 });
                const response = await request(server).get("/user/getSettings?token=hyxjnscjksdcnhsdvcnsd").send({});

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings?token=").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 404 status code", async () => {
                const response = await request(server).get("/user/getSettings?token=lalalalallllll").send({});

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID MODIFY DATAS TESTS]", () => {
            test("should modify datas with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ email: "emaillllllllllllllllllllllllllllllll" });
                User.find = jest.fn().mockReturnValue(null);
                User.findUsername = jest.fn().mockReturnValue(null);
                User.modifyDatas = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).post("/user/modifyDatas").send({
                    token: "emailcbdbcjnsnicwsnwsjcbdycbdd",
                    username: "usernamenvhksdjksdasdbjhasg",
                    new_email: "emailnvhksdjksdasdbjhasg",
                    password: "pass2"
                });

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID MODIFY DATAS TESTS]", () => {
            test("should modify datas with a 400 status code", async () => {
                const response = await request(server).post("/user/modifyDatas").send({
                    token: "",
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should modify datas with a 400 status code", async () => {
                const response = await request(server).post("/user/modifyDatas").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should modify datas with a 404 status code", async () => {
                const response = await request(server).post("/user/modifyDatas").send({
                    token: " "
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("should modify datas with a 409 status code (email already used)", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1 });
                User.find = jest.fn().mockReturnValue({id: 1});
                response = await request(server).post("/user/modifyDatas").send({
                    token: "emailcbdbcjnsnicwsnwsjcbdycbdd",
                    username: "usernamenvhksdjksdasdbjhasg",
                    new_email: "emailnvhksdjksdasdbjhasg",
                    password: "pass2"
                });

                expect(response.statusCode).toBe(409);
            });
            test("should modify datas with a 409 status code (username already used)", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1 });
                User.find = jest.fn().mockReturnValue(null);
                User.findUsername = jest.fn().mockReturnValue({id: 1});
                response = await request(server).post("/user/modifyDatas").send({
                    token: "emailcbdbcjnsnicwsnwsjcbdycbdd",
                    username: "usernamenvhksdjksdasdbjhasg",
                    new_email: "emailnvhksdjksdasdbjhasg",
                    password: "pass2"
                });

                expect(response.statusCode).toBe(409);
            });
        });
        describe("[VALID MODIFY SETTINGS TESTS]", () => {
            test("should modify settings with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ email: "emaillllllllllllllllllllllllllllllll", id: 1 });
                Settings.modifySettings = jest.fn().mockReturnValue({ id: 1 });
                const response = await request(server).get("/user/modifySettings").query({
                    token: "emaiiiiiljbcsjcjsdncdsncksdnv",
                    night_mode: true,
                });
                
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID MODIFY SETTINGS TESTS]", () => {
            test("should modify settings with a 400 status code", async () => {
                const response = await request(server).get("/user/modifySettings").query({
                    token: "",
                });

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should modify settings with a 400 status code", async () => {
                const response = await request(server).get("/user/modifySettings").query({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should modify settings with a 404 status code", async () => {
                const response = await request(server).get("/user/modifySettings").query({
                    token: " "
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ email: "emaillllllllllllllllllllllllllllllll" });
                Settings.get = jest.fn().mockReturnValue({ id: 1 });
                const response = await request(server).get("/user/getSettings?token=hyxjnscjksdcnhsdvcnsd").send({});

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings?token=").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 404 status code", async () => {
                const response = await request(server).get("/user/getSettings?token=lalalalallllll").send({});

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        descripe("[VALID SEND VERIFICATION EMAIL TESTS]", () => {
            test("should send verification email with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1, email: "emma.rulliere@epitech.eu" });

                const response = await request(server).get("/user/sendVerificationEmail?token=hyxjnscjksdcnhsdvcnsd").send({});

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        descripe("[INVALID SEND VERIFICATION EMAIL TESTS]", () => {
            test("should send verification email with a 400 status code", async () => {
                const response = await request(server).get("/user/sendVerificationEmail?token=").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should send verification email with a 400 status code", async () => {
                const response = await request(server).get("/user/sendVerificationEmail").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should send verification email with a 404 status code", async () => {
                const response = await request(server).get("/user/sendVerificationEmail?token=lalalalallllll").send({});
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("should send verification email with a 409 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1, email_verified: true });

                const response = await request(server).get("/user/sendVerificationEmail?token=hyxjnscjksdcnhsdvcnsd").send({});
                expect(response.statusCode).toBe(409);
                expect(response.message).not.toBeNull();
            });
        });
        descripe("[VALID VERIFY EMAIL TESTS]", () => {
            test("should verify email with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1 });
                User.verifyEmail = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).get("/user/verifyEmail?token=hyxjnscjksdcnhsdvcnsd").send({});
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        test('[REGISTER 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'find').throws(new Error('db query failed'));

                response = await request(server).post("/user/register").send({
                    email: 'email',
                    password: 'password',
                    username: 'gfhg'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[LOGIN 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'connect').throws(new Error('db query failed'));

                response = await request(server).post("/user/login").send({
                    email: 'email',
                    password: 'password'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[GET BY EMAIL 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'find').throws(new Error('db query failed'));

                response = await request(server).get("/user/getbyemail").query({
                    email: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[GET BY USERNAME 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findUsername').throws(new Error('db query failed'));

                response = await request(server).get("/user/getbyusername").query({
                    username: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[GET SETTINGS 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findToken').throws(new Error('db query failed'));

                response = await request(server).get("/user/getSettings").query({
                    token: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[DELETE 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findToken').throws(new Error('db query failed'));

                response = await request(server).get("/user/delete").query({
                    token: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[MODIFY DATAS 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findToken').throws(new Error('db query failed'));

                response = await request(server).post("/user/modifyDatas").send({
                    token: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[MODIFY SETTINGS 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findToken').throws(new Error('db query failed'));

                response = await request(server).get("/user/modifySettings").query({
                    token: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[GET BY TOKEN 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findToken').throws(new Error('db query failed'));

                response = await request(server).get("/user/getbytoken").query({
                    token: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
    });
});