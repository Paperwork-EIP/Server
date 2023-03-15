const request = require("supertest");
const sinon = require("sinon");
const router = require("../../src/api/db/user");
const { start, stop } = require('../../index');
const User = require('../../src/persistence/users');

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
        describe("[VALID DELETE TESTS]", () => {
            test("should delete an user with a 200 status code", async () => {
                const response = await request(server).get("/user/delete?email=emaillllllllllllllllllllllllllllllll").send({});

                expect(response.statusCode).toBe(200);
            });
        });
        describe("[INVALID DELETE TESTS]", () => {
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete?email=").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should delete an user with a 400 status code", async () => {
                const response = await request(server).get("/user/delete").send({});

                expect(response.statusCode).toBe(400);
            });
            test("should delete an user with a 404 status code", async () => {
                const response = await request(server).get("/user/delete?email=lalalalalllllllllllllllllll").send({});

                expect(response.statusCode).toBe(404);
            });
        });
        describe("[VALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 200 status code", async () => {
                const user = await request(server).post("/user/register").send({
                    email: "hyxjnscjksdcnhsdvcnsd",
                    username: "hyxjnscjksdcnhsdvcnsd",
                    password: "pass"
                });
                const response = await request(server).get("/user/getSettings?email=hyxjnscjksdcnhsdvcnsd").send({});
                const deleteUser = await request(server).get("/user/delete?email=hyxjnscjksdcnhsdvcnsd").send({});

                expect(user.statusCode).toBe(200);
                expect(user.message).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
        });
        describe("[INVALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings?email=").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 404 status code", async () => {
                const response = await request(server).get("/user/getSettings?email=lalalalallllll").send({});

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID MODIFY DATAS TESTS]", () => {
            test("should modify datas with a 200 status code", async () => {
                const user = await request(server).post("/user/register").send({
                    email: "emailcbdbcjnsnicwsnwsjcbdycbdd",
                    username: "usernamecbdbcjnsnicwsnwsjcbdycbdd",
                    password: "pass"
                });
                const response = await request(server).post("/user/modifyDatas").send({
                    email: "emailcbdbcjnsnicwsnwsjcbdycbdd",
                    username: "usernamenvhksdjksdasdbjhasg",
                    new_email: "emailnvhksdjksdasdbjhasg",
                    password: "pass2"
                });
                const getByUsername = await request(server).get("/user/getbyusername?username=usernamenvhksdjksdasdbjhasg").send({});
                const login = await request(server).post("/user/login").send({
                    email: "emailnvhksdjksdasdbjhasg",
                    password: "pass2"
                });
                const getByOldEmail = await request(server).get("/user/getbyemail?email=emailcbdbcjnsnicwsnwsjcbdycbdd").send({});
                const getByNewEmail = await request(server).get("/user/getbyemail?email=emailnvhksdjksdasdbjhasg").send({});
                const getByOldUsername = await request(server).get("/user/getbyusername?username=usernamecbdbcjnsnicwsnwsjcbdycbdd").send({});
                const deleteUser = await request(server).get("/user/delete?email=emailnvhksdjksdasdbjhasg").send({});

                expect(user.statusCode).toBe(200);
                expect(user.message).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(getByUsername.statusCode).toBe(200);
                expect(getByUsername.message).not.toBeNull();

                expect(login.statusCode).toBe(200);
                expect(login.message).not.toBeNull();

                expect(getByOldEmail.statusCode).toBe(404);
                expect(getByOldEmail.message).not.toBeNull();

                expect(getByNewEmail.statusCode).toBe(200);
                expect(getByNewEmail.message).not.toBeNull();

                expect(getByOldUsername.statusCode).toBe(404);
                expect(getByOldUsername.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
        });
        describe("[INVALID MODIFY DATAS TESTS]", () => {
            test("should modify datas with a 400 status code", async () => {
                const response = await request(server).post("/user/modifyDatas").send({
                    email: "",
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
                    email: " "
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID MODIFY SETTINGS TESTS]", () => {
            test("should modify settings with a 200 status code", async () => {
                const user = await request(server).post("/user/register").send({
                    email: "emaiiiiiljbcsjcjsdncdsncksdnv",
                    username: "usernamebcidsncjdnscseeeee",
                    password: "pass"
                });
                const response = await request(server).get("/user/modifySettings").query({
                    email: "emaiiiiiljbcsjcjsdncdsncksdnv",
                    night_mode: true,
                });
                const deleteUser = await request(server).get("/user/delete?email=emaiiiiiljbcsjcjsdncdsncksdnv").send({});

                expect(user.statusCode).toBe(200);
                expect(user.message).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
        });
        describe("[INVALID MODIFY SETTINGS TESTS]", () => {
            test("should modify settings with a 400 status code", async () => {
                const response = await request(server).get("/user/modifySettings").query({
                    email: "",
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
                    email: " "
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 200 status code", async () => {
                const user = await request(server).post("/user/register").send({
                    email: "hyxjnscjksdcnhsdvcnsd",
                    username: "hyxjnscjksdcnhsdvcnsd",
                    password: "pass"
                });
                const response = await request(server).get("/user/getSettings?email=hyxjnscjksdcnhsdvcnsd").send({});
                const deleteUser = await request(server).get("/user/delete?email=hyxjnscjksdcnhsdvcnsd").send({});

                expect(user.statusCode).toBe(200);
                expect(user.message).not.toBeNull();
                
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
        });
        describe("[INVALID GET SETTINGS TESTS]", () => {
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings?email=").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 400 status code", async () => {
                const response = await request(server).get("/user/getSettings").send({});

                expect(response.statusCode).toBe(400);
                expect(response.message).not.toBeNull();
            });
            test("should get settings with a 404 status code", async () => {
                const response = await request(server).get("/user/getSettings?email=lalalalallllll").send({});

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID MODIFY DATAS TESTS]", () => {
            test("should modify datas with a 200 status code", async () => {
                const user = await request(server).post("/user/register").send({
                    email: "emailcbdbcjnsnicwsnwsjcbdycbdd",
                    username: "usernamecbdbcjnsnicwsnwsjcbdycbdd",
                    password: "pass"
                });
                const response = await request(server).post("/user/modifyDatas").send({
                    email: "emailcbdbcjnsnicwsnwsjcbdycbdd",
                    username: "usernamenvhksdjksdasdbjhasg",
                    new_email: "emailnvhksdjksdasdbjhasg",
                    password: "pass2"
                });
                const getByUsername = await request(server).get("/user/getbyusername?username=usernamenvhksdjksdasdbjhasg").send({});
                const login = await request(server).post("/user/login").send({
                    email: "emailnvhksdjksdasdbjhasg",
                    password: "pass2"
                });
                const getByOldEmail = await request(server).get("/user/getbyemail?email=emailcbdbcjnsnicwsnwsjcbdycbdd").send({});
                const getByNewEmail = await request(server).get("/user/getbyemail?email=emailnvhksdjksdasdbjhasg").send({});
                const getByOldUsername = await request(server).get("/user/getbyusername?username=usernamecbdbcjnsnicwsnwsjcbdycbdd").send({});
                const deleteUser = await request(server).get("/user/delete?email=emailnvhksdjksdasdbjhasg").send({});

                expect(user.statusCode).toBe(200);
                expect(user.message).not.toBeNull();
                
                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(getByUsername.statusCode).toBe(200);
                expect(getByUsername.message).not.toBeNull();

                expect(login.statusCode).toBe(200);
                expect(login.message).not.toBeNull();

                expect(getByOldEmail.statusCode).toBe(404);
                expect(getByOldEmail.message).not.toBeNull();

                expect(getByNewEmail.statusCode).toBe(200);
                expect(getByNewEmail.message).not.toBeNull();

                expect(getByOldUsername.statusCode).toBe(404);
                expect(getByOldUsername.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
        });
        describe("[INVALID MODIFY DATAS TESTS]", () => {
            test("should modify datas with a 400 status code", async () => {
                const response = await request(server).post("/user/modifyDatas").send({
                    email: "",
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
                    email: " "
                });

                expect(response.statusCode).toBe(404);
                expect(response.message).not.toBeNull();
            });
        });
        describe("[VALID MODIFY SETTINGS TESTS]", () => {
            test("should modify settings with a 200 status code", async () => {
                const user = await request(server).post("/user/register").send({
                    email: "emaiiiiiljbcsjcjsdncdsncksdnv",
                    username: "usernamebcidsncjdnscseeeee",
                    password: "pass"
                });
                const response = await request(server).get("/user/modifySettings").query({
                    email: "emaiiiiiljbcsjcjsdncdsncksdnv",
                    night_mode: true,
                });
                const deleteUser = await request(server).get("/user/delete?email=emaiiiiiljbcsjcjsdncdsncksdnv").send({});

                expect(user.statusCode).toBe(200);
                expect(user.message).not.toBeNull();

                expect(response.statusCode).toBe(200);
                expect(response.message).not.toBeNull();

                expect(deleteUser.statusCode).toBe(200);
                expect(deleteUser.message).not.toBeNull();
            });
        });
        describe("[INVALID MODIFY SETTINGS TESTS]", () => {
            test("should modify settings with a 400 status code", async () => {
                const response = await request(server).get("/user/modifySettings").query({
                    email: "",
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
                    email: " "
                });

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
                sinon.stub(User, 'find').throws(new Error('db query failed'));

                response = await request(server).get("/user/getSettings").query({
                    email: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[DELETE 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'find').throws(new Error('db query failed'));

                response = await request(server).get("/user/delete").query({
                    email: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[MODIFY DATAS 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'find').throws(new Error('db query failed'));

                response = await request(server).get("/user/modifyDatas").query({
                    email: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
        test('[MODIFY SETTINGS 500] should throw an error if an error occurs', async () => {
            let response;

            try {
                sinon.stub(User, 'find').throws(new Error('db query failed'));

                response = await request(server).get("/user/modifySettings").query({
                    email: 'email'
                });
            } catch (error) {
                expect(response.statusCode).toBe(500);
                expect(response._body.message).toEqual('System error.');
            }
        });
    });
});