// const userProcess = require("../../src/persistence/userProcess");

// var mockTitle = "TestTitle";
// var mockProcessTitle = "mockProcess";
// var mockUserMail = "mock@mock.com";

// describe("User Process Tests", () => {
//     test("[UNIT TEST] Call create an account function - success", () => {
//         var result = userProcess.create(mockProcessTitle, mockUserMail);

//         expect(result).not.toBeNull();
//     });

//     test("[UNIT TEST] Call delete an account - success", () => {
//         var result = userProcess.delete(mockTitle);

//         expect(result).not.toBeNull();
//     });

//     test("[UNIT TEST] Call get user's steps - success", () => {
//         var result = userProcess.getUserSteps(mockProcessTitle, mockUserMail);

//         expect(result).not.toBeNull();
//     });
// });

const sum = require('../sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});