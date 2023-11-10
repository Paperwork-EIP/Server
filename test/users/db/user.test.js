const request = require("supertest");
const sinon = require("sinon");
const router = require("../../../src/routes/users/db/user");
const { start, stop } = require('../../../index');
const User = require('../../../src/persistence/users/users');
const Settings = require('../../../src/persistence/users/userSettings');
const init_db = require('../../../src/persistence/init-db');

describe("User connection tests", () => {
    const port = 3002;
    let server;

    afterEach(() => {
        jest.restoreAllMocks();
        sinon.restore();
    });

    beforeAll(async () => {
        server = await start(port);
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
        describe("[VALID SEND VERIFICATION EMAIL TESTS]", () => {
            test("should send verification email with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1, email: "emma.rulliere@epitech.eu" });

                const response = await request(server).get("/user/sendVerificationEmail?token=hyxjnscjksdcnhsdvcnsd").send({});

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID SEND VERIFICATION EMAIL TESTS]", () => {
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
        describe("[VALID VERIFY EMAIL TESTS]", () => {
            test("should verify email with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1 });
                User.setEmailVerified = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).get("/user/verifyEmail?token=hyxjnscjksdcnhsdvcnsd").send({});
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID VERIFY EMAIL TESTS]", () => {
            test("should verify email with a 400 status code", async () => {
                const response = await request(server).get("/user/verifyEmail?token=").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should verify email with a 400 status code", async () => {
                const response = await request(server).get("/user/verifyEmail").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should verify email with a 404 status code", async () => {
                const response = await request(server).get("/user/verifyEmail?token=lalalalallllll").send({});
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
            test("should verify email with a 409 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1, email_verified: true });

                const response = await request(server).get("/user/verifyEmail?token=hyxjnscjksdcnhsdvcnsd").send({});
                expect(response.statusCode).toBe(409);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID SEND RESET PASSWORD EMAIL TESTS]", () => {
            test("should send reset password email with a 200 status code", async () => {
                User.find = jest.fn().mockReturnValue({ email: "emma.rulliere@epitech.eu" });
                User.setToken = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).get("/user/sendResetPasswordEmail?email=emma.rulliere@epitech.eu").send({});
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID SEND RESET PASSWORD EMAIL TESTS]", () => {
            test("should send reset password email with a 400 status code", async () => {
                const response = await request(server).get("/user/sendResetPasswordEmail?email=").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should send reset password email with a 400 status code", async () => {
                const response = await request(server).get("/user/sendResetPasswordEmail").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should send reset password email with a 404 status code", async () => {
                const response = await request(server).get("/user/sendResetPasswordEmail?email=tesssst").send({});
                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID RESET PASSWORD TESTS]", () => {
            test("should reset password with a 200 status code", async () => {
                User.findToken = jest.fn().mockReturnValue({ id: 1 });
                User.setPassword = jest.fn().mockReturnValue({ id: 1 });

                const response = await request(server).get("/user/resetPassword?token=hyxjnscjksdcnhsdvcnsd&password=test").send({});
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[INVALID RESET PASSWORD TESTS]", () => {
            test("should reset password with a 400 status code, token empty", async () => {
                const response = await request(server).get("/user/resetPassword?token=&password=lalala").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should reset password with a 400 status code, missing token", async () => {
                const response = await request(server).get("/user/resetPassword?password=lalaal").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should reset password with a 400 status code, no arguments", async () => {
                const response = await request(server).get("/user/resetPassword").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should reset password with a 400 status code, password missing", async () => {
                const response = await request(server).get("/user/resetPassword?token=hyxjnscjksdcnhsdvcnsd").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should reset password with a 400 status code, password empty", async () => {
                const response = await request(server).get("/user/resetPassword?token=hyxjnscjksdcnhsdvcnsd&password=").send({});
                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should reset password with a 404 status code", async () => {
                const response = await request(server).get("/user/resetPassword?token=lalalalallllll&password=test").send({});
                expect(response.statusCode).toBe(404);
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
        test('[SEND VERIFICATION EMAIL 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findToken').throws(new Error('db query failed'));

                response = await request(server).get("/user/sendVerificationEmail").query({
                    token: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[VERIFY EMAIL 500] should throw an error if an error occurs', async () => {
            let response;
            User.findToken = jest.fn().mockReturnValue({ id: 1, email_verified: true });

            try {
                sinon.stub(User, 'setEmailVerified').throws(new Error('db query failed'));

                response = await request(server).get("/user/verifyEmail").query({
                    token: 'email',
                    email: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[SEND RESET PASSWORD EMAIL 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'find').throws(new Error('db query failed'));

                response = await request(server).get("/user/sendResetPasswordEmail").query({
                    email: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[RESET PASSWORD 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'findToken').throws(new Error('db query failed'));

                response = await request(server).get("/user/resetPassword").query({
                    token: 'email',
                    password: 'password'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
    });
});