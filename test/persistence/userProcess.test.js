const express = require("express");
const userProcess = require("../../src/persistence/userProcess");

// UNIT TEST = tester la présence des composants.
// INTEGRATION TEST  = tester les requêtes si elles sont correct ou s'il y a des erreurs.

var mockTitle = "TestTitle";
var mockProcessTitle = "mockProcess";
var mockUserMail = "mock@mock.com";

describe("User Process Tests", () => {
    test("[UNIT TEST] Call create an account function - success", () => {
        var result = userProcess.create(mockProcessTitle, mockUserMail);

        expect(result).not.toBeNull();
    });

    test("[UNIT TEST] Call delete an account - success", () => {
        var result = userProcess.delete(mockTitle);

        expect(result).not.toBeNull();
    });

    test("[UNIT TEST] Call get user's steps - success", () => {
        var result = userProcess.getUserSteps(mockProcessTitle, mockUserMail);

        expect(result).not.toBeNull();
    });
});