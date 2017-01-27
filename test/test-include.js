"use strict";
var chai = require("chai");
var insensitivity = require("../insensitive-chai");
chai.use(insensitivity);
var should = chai.should();

function testCases(fill, haystack, needle) {
  haystack.should.insensitively.include(needle);
  (fill+" "+haystack).should.insensitively.include(needle);
  (haystack + " "+fill).should.insensitively.include(needle);
  (fill+" "+haystack+" "+fill).should.insensitively.include(needle);
  (fill+haystack+fill).should.insensitively.include(needle);
}

describe(".insensitively.include", function() {

  it("should work with matching case", function() {
    testCases("foo", "test", "test");
  });

  it("should match mixed case", function() {
    let target = "Test";
    testCases("foo", "test", target);
    testCases("Foo", "Test", target);
    testCases("FOO", "TEST", target);
    testCases("foo", "TEST", target);
  });

  it("should match lower case", function() {
    let target = "test";
    testCases("foo", "test", target);
    testCases("Foo", "Test", target);
    testCases("FOO", "TEST", target);
    testCases("foo", "TEST", target);
  });

  it("should match upper case", function() {
    let target = "TEST";
    testCases("foo", "test", target);
    testCases("Foo", "Test", target);
    testCases("FOO", "TEST", target);
    testCases("foo", "TEST", target);
  });

  it("should work with .insensitive alias", function() {
    "test".should.insensitive.include("TEST");
    "TEST".should.insensitive.include("test");
  });

  for(const alias of ["includes", "contain", "contains"]) {
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
      (() => "test".should.insensitively.include(val)).should.throw;
      (() => val.should.insensitively.include("test")).should.throw;
      (() => val.should.insensitively.include(val)).should.throw;
    }
    i.should.equal(types.length);
  });

  describe("shouldn't break normal .include", function() {

    it("should work with non-strings", function() {
      let x = {a: 1};
      x.should.include(x);
    });

  });

});
