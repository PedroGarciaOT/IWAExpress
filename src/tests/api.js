var assert = require('assert');
var expect = require("chai").expect;
//var api = require("../routes/api");

describe('API Test Suite', function () {
    it('Test 1', function () {
        assert.ok(true, "This shouldn't fail");
    });

    it('Test 2', function () {
        assert.ok(1 === 1, "This shouldn't fail");
        //assert.ok(false, "This should fail");
    });
});
