const express = require("express");
const request = require("supertest");
const userProcess = require("../../src/process/userProcess");

const app = express();

app.use("/user/process", userProcess);

var mockTitle = "TestTitle";
var mockProcessTitle = "mockProcess";
var mockUserMail = "mock@mock.com";

describe("User Process Tests", () => {
    test("[INTEGRATION TEST] [POST] /add request - success", async () => {
        const { body } = await request(app).get("/user/process");

        expect(body.response).toEqual("User process and user steps created!");
    });
});
