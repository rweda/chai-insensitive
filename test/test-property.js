"use strict";
var chai = require("chai");
var insensitivity = require("../insensitive-chai");
chai.use(insensitivity);
var should = chai.should();

function testCases(fill, haystack, needle) {
  let only = {};
  only[haystack] = haystack;
  only.should.have.insensitive.property(needle);
  only.should.have.insensitive.property(needle, needle);
  let mixed = {};
  mixed[haystack] = haystack;
  mixed[fill] = fill;
  mixed.should.have.insensitive.property(needle);
  mixed.should.have.insensitive.property(needle, needle);
}

describe(".insensitively.property", function() {

  it("should find exact matches", function() {
    ({foo: "bar"}).should.have.insensitive.property("foo");
    ({foo: "bar"}).should.have.insensitive.property("foo", "bar");
  })

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
    ({foo: "bar"}).should.have.insensitive.property("FOO");
  });

  for(const alias of ["ownProperty", "haveOwnProperty"]) {
    it.skip("should work with ."+alias+" alias", function() {
      // TODO
    });
  }

  it("should throw an error if given non-string needles", function() {
    let types = [1, {a: 1}, [1, 2], ["a", "b"]];
    for(const val of types) {
      (() => ({foo: "bar"}).should.insensitively.include(val)).should.throw;
    }
  });

  it("should throw an error if given non-array haystacks", function() {
    let types = [1, {a: 1}, [1, 2], ["a", "b"]];
    for(const val of types) {
      (() => val.should.insensitively.include("foo")).should.throw;
    }
  });

  describe.skip("shouldn't break normal .property", function() {

    it("should do something?", function() {
      // TODO
    });

  });

});
