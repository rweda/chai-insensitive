var x = 0;
function plugin(chai, utils) {
  var Assertion = chai.Assertion;

  function useSuper(_super) {
    return function() {
      _super.apply(this, arguments);
    }
  }

  function insensitive(n) {
    new Assertion(this._obj).to.be.a("string");
  }

  function insensitiveChaining() {
    utils.flag(this, 'string.insensitive', true);
  }

  Assertion.addProperty('insensitive', insensitiveChaining);
  Assertion.addProperty('insensitively', insensitiveChaining);

  //Assertion.addChainableMethod('insensitive', insensitive, insensitiveChaining);
  //Assertion.addChainableMethod('insensitively', insensitive, insensitiveChaining);

  function assertInsensitiveEqual(_super) {
    return function insensitiveEqual(n) {
      if(!utils.flag(this, 'string.insensitive')) { return _super.apply(this, arguments); }
      new Assertion(this._obj).to.be.a("string");
      this.assert(
        this._obj.toLowerCase() === n.toLowerCase(),
        "expected #{this} to equal #{exp} (case insensitive)",
        "expected #{this} to not equal #{exp} (case insensitive)",
        n
      );
    };
  }

  Assertion.overwriteMethod('equal', assertInsensitiveEqual);
  Assertion.overwriteMethod('equals', assertInsensitiveEqual);
  Assertion.overwriteMethod('eq', assertInsensitiveEqual);

  function assertInsensitiveInclude(_super) {
    return function insensitiveInclude(n) {
      if(!utils.flag(this, 'string.insensitive')) { return _super.apply(this, arguments); }
      new Assertion(this._obj).to.be.a("string");
      this.assert(
        this._obj.toLowerCase().indexOf(n.toLowerCase),
        "expected #{this} to include #{exp} (case insensitive)",
        "expected #{this} to not include #{exp} (case insensitive)",
        n
      );
    }
  }

  Assertion.overwriteChainableMethod('include', assertInsensitiveInclude, useSuper);
  Assertion.overwriteChainableMethod('contain', assertInsensitiveInclude, useSuper);
  Assertion.overwriteChainableMethod('includes', assertInsensitiveInclude, useSuper);
  Assertion.overwriteChainableMethod('contains', assertInsensitiveInclude, useSuper);

  function assertInsensitiveProperty(name, val) {
    var isNested = utils.flag(this, 'nested');
    var isOwn = utils.flag(this, 'own');
    if(isNested && isOwn) {
      throw new Error('The "nested" and "own" flags cannot be combined.');
    }
    var lower = name.toLowerCase();
    var upper = name.toUpperCase();
    var isDeep = utils.flag(this, 'deep');
    var negate = utils.flag(this, 'negate');
    var obj = utils.flag(this, 'object');
    new Assertion(obj).to.be.an("object");
    //TODO: Fix so not just all upper/all lower
    var pathInfo = isNested ?
      utils.getPathInfo(obj, name) || utils.getPathInfo(obj, lower) || utils.getPathInfo(obj, upper) :
      null;
    //TODO: Fix so not just all upper/all lower
    var value = isNested ? pathInfo.value : obj[name] || obj[lower] || obj[upper];

    var descriptor = '';
    if(isDeep) descriptor += 'deep ';
    if(isOwn) descriptor += 'own ';
    if(isNested) descriptor += 'nested ';
    descriptor += 'property ';

    var hasProperty;
    if(isOwn) {
      //TODO: Fix so not just all upper/all lower
      hasProperty = Object.prototype.hasOwnProperty.call(obj, name)
        || Object.prototype.hasOwnProperty.call(obj, upper) || Object.prototype.hasOwnProperty.call(obj, lower);
    }
    else if(isNested) {
      hasProperty = pathInfo.exists;
    }
    else {
      //TODO: Fix to not just use all upper/all lower.
      hasProperty = utils.hasProperty(obj, name) || utils.hasProperty(obj, upper) || utils.hasProperty(obj, lower);
    }

    if(!negate || arguments.length === 1) {
      this.assert(
        hasProperty,
        "expected #{this} to have " + descriptor + utils.inspect(name) + " (case insensitive)",
        "expected #{this} to not have " + descriptor + utils.inspect(name) + " (case insensitive)"
      );
    }

    if(arguments.length > 1) {
      this.assert(
        hasProperty && (isDeep ? utils.eql(val, value) : val === value),
        "expected #{this} to have " + descriptor + utils.inspect(name) + " of #{exp} (case insensitive), but got #{act}",
        "expected #{this} to not have " + descriptor + utils.inspect(name) + " of #{exp} (case insensitive), but got #{act}",
        val, value
      );
    }

    flag(this, 'object', value);
  }

  Assertion.overwriteMethod('property', function(_super) {
    return function insensitiveProperty(name, val) {
      if(!utils.flag(this, 'string.insensitive')) { return _super.apply(this, arguments); }
      assertInsensitiveProperty.apply(this, arguments);
    }
  });

  function assertOwnInsensitiveProperty(_super) {
    return function ownInsensitiveProperty(name, val) {
      flag(this, 'own', true);
      if(!utils.flag(this, 'string.insensitive')) { return _super.apply(this, arguments); }
      assertInsensitiveProperty.apply(name, val);
    }
  }

  Assertion.overwriteMethod('ownProperty', assertOwnInsensitiveProperty);
  Assertion.overwriteMethod('haveOwnProperty', assertOwnInsensitiveProperty);

}

if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
  module.exports = plugin;
}
else if (typeof define === "function" && define.amd) {
  define(function () {
    return plugin;
  });
}
else {
  // Other environment (usually <script> tag): plug in to global chai instance directly.
  chai.use(plugin);
}
