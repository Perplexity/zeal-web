"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var _server_1 = __importDefault(require("@server"));
var UserDao_mock_1 = __importDefault(require("@daos/User/UserDao.mock"));
var User_1 = __importDefault(require("@entities/User"));
var functions_1 = require("@shared/functions");
var constants_1 = require("@shared/constants");
describe('Users Routes', function () {
    var usersPath = '/api/users';
    var getUsersPath = usersPath + "/all";
    var addUsersPath = usersPath + "/add";
    var updateUserPath = usersPath + "/update";
    var deleteUserPath = usersPath + "/delete/:id";
    var BAD_REQUEST = http_status_codes_1.default.BAD_REQUEST, CREATED = http_status_codes_1.default.CREATED, OK = http_status_codes_1.default.OK;
    var agent;
    beforeAll(function (done) {
        agent = supertest_1.default.agent(_server_1.default);
        done();
    });
    describe("\"GET:" + getUsersPath + "\"", function () {
        it("should return a JSON object with all the users and a status code of \"" + OK + "\" if the\n            request was successful.", function (done) {
            // Setup spy
            var users = [
                new User_1.default('Sean Maxwell', 'sean.maxwell@gmail.com'),
                new User_1.default('John Smith', 'john.smith@gmail.com'),
                new User_1.default('Gordan Freeman', 'gordan.freeman@gmail.com'),
            ];
            spyOn(UserDao_mock_1.default.prototype, 'getAll').and.returnValue(Promise.resolve(users));
            // Call API
            agent.get(getUsersPath)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(OK);
                // Caste instance-objects to 'User' objects
                var respUsers = res.body.users;
                var retUsers = respUsers.map(function (user) {
                    return new User_1.default(user);
                });
                expect(retUsers).toEqual(users);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });
        it("should return a JSON object containing an error message and a status code of\n            \"" + BAD_REQUEST + "\" if the request was unsuccessful.", function (done) {
            // Setup spy
            var errMsg = 'Could not fetch users.';
            spyOn(UserDao_mock_1.default.prototype, 'getAll').and.throwError(errMsg);
            // Call API
            agent.get(getUsersPath)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });
    describe("\"POST:" + addUsersPath + "\"", function () {
        var callApi = function (reqBody) {
            return agent.post(addUsersPath).type('form').send(reqBody);
        };
        var userData = {
            user: new User_1.default('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };
        it("should return a status code of \"" + CREATED + "\" if the request was successful.", function (done) {
            // Setup Spy
            spyOn(UserDao_mock_1.default.prototype, 'add').and.returnValue(Promise.resolve());
            // Call API
            agent.post(addUsersPath).type('form').send(userData)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(CREATED);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });
        it("should return a JSON object with an error message of \"" + constants_1.paramMissingError + "\" and a status\n            code of \"" + BAD_REQUEST + "\" if the user param was missing.", function (done) {
            // Call API
            callApi({})
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(constants_1.paramMissingError);
                done();
            });
        });
        it("should return a JSON object with an error message and a status code of \"" + BAD_REQUEST + "\"\n            if the request was unsuccessful.", function (done) {
            // Setup spy
            var errMsg = 'Could not add user.';
            spyOn(UserDao_mock_1.default.prototype, 'add').and.throwError(errMsg);
            // Call API
            callApi(userData)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(errMsg);
                done();
            });
        });
    });
    describe("\"PUT:" + updateUserPath + "\"", function () {
        var callApi = function (reqBody) {
            return agent.put(updateUserPath).type('form').send(reqBody);
        };
        var userData = {
            user: new User_1.default('Gordan Freeman', 'gordan.freeman@gmail.com'),
        };
        it("should return a status code of \"" + OK + "\" if the request was successful.", function (done) {
            // Setup spy
            spyOn(UserDao_mock_1.default.prototype, 'update').and.returnValue(Promise.resolve());
            // Call Api
            callApi(userData)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });
        it("should return a JSON object with an error message of \"" + constants_1.paramMissingError + "\" and a\n            status code of \"" + BAD_REQUEST + "\" if the user param was missing.", function (done) {
            // Call api
            callApi({})
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(constants_1.paramMissingError);
                done();
            });
        });
        it("should return a JSON object with an error message and a status code of \"" + BAD_REQUEST + "\"\n            if the request was unsuccessful.", function (done) {
            // Setup spy
            var updateErrMsg = 'Could not update user.';
            spyOn(UserDao_mock_1.default.prototype, 'update').and.throwError(updateErrMsg);
            // Call API
            callApi(userData)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(updateErrMsg);
                done();
            });
        });
    });
    describe("\"DELETE:" + deleteUserPath + "\"", function () {
        var callApi = function (id) {
            return agent.delete(deleteUserPath.replace(':id', id.toString()));
        };
        it("should return a status code of \"" + OK + "\" if the request was successful.", function (done) {
            // Setup spy
            spyOn(UserDao_mock_1.default.prototype, 'delete').and.returnValue(Promise.resolve());
            // Call api
            callApi(5)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(OK);
                expect(res.body.error).toBeUndefined();
                done();
            });
        });
        it("should return a JSON object with an error message and a status code of \"" + BAD_REQUEST + "\"\n            if the request was unsuccessful.", function (done) {
            // Setup spy
            var deleteErrMsg = 'Could not delete user.';
            spyOn(UserDao_mock_1.default.prototype, 'delete').and.throwError(deleteErrMsg);
            // Call Api
            callApi(1)
                .end(function (err, res) {
                functions_1.pErr(err);
                expect(res.status).toBe(BAD_REQUEST);
                expect(res.body.error).toBe(deleteErrMsg);
                done();
            });
        });
    });
});
