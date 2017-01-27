"use strict";
var chai = require("chai");
var insensitivity = require("../insensitive-chai");
chai.use(insensitivity);
var should = chai.should();

describe(".insensitively.equal", function() {

  it("should work with matching case", function() {
    "test".should.insensitively.equal("test");
  });

  it("should match mixed case", function() {
    "test".should.insensitively.equal("Test");
    "Test".should.insensitively.equal("Test");
    "TEST".should.insensitively.equal("Test");
  });

  it("should match lower case", function() {
    "test".should.insensitively.equal("test");
    "Test".should.insensitively.equal("test");
    "TEST".should.insensitively.equal("test");
  });

  it("should match upper case", function() {
    "test".should.insensitively.equal("TEST");
    "Test".should.insensitively.equal("TEST");
    "TEST".should.insensitively.equal("TEST");
  });

  it("should work with .insensitive alias", function() {
    "test".should.insensitive.equal("TEST");
    "TEST".should.insensitive.equal("test");
  });

  for(const alias of ["equals", "eq"]) {
    it("should work with ."+alias+" alias", function() {
      "test".should.insensitive[alias]("TEST");
      "TEST".should.insensitive[alias]("test");
    });
  }

  it("should throw an error if given non-strings", function() {
    let i = 0;
    let types = [1, {a: 1}, [1, 2], ["a", "b"]];
    for(const val of types) {
      i++;
      (() => "test".should.insensitively.equal(val)).should.throw;
      (() => val.should.insensitively.equal("test")).should.throw;
      (() => val.should.insensitively.equal(val)).should.throw;
    }
    i.should.equal(types.length);
  });

  describe("shouldn't break normal .equal", function() {

    it("should work with non-strings", function() {
      (1).should.equal(1);
      (1).should.not.equal(2);
      let x = {a: 1};
      x.should.equal(x);
    });

  });

});
