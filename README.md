# Insensitive Chai

Case-insensitive modifier for Chai.

## Installation

(chai-insensitive also should work in the browser: include `insensitive-chai.js` via RequireJS or a `<script>` tag)

Download the package from NPM:

```
npm install --save chai-insensitive
```

Use in a testing file:

```js
var chai = require("chai");
var insensitivity = require("chai-insensitive");
chai.use(insensitivity);
```

## Usage

Chain `.insensitively` (or `.insensitive`) when writing a Chai statement.

```js
"TEST".should.insensitively.equal("test");
```

Works with:
- `.equal` (aliases: `.equals`, `.eq`)
- `.include` (aliases: `.includes`, `.contain`, `.contains`)

Future methods:
- `.property` (aliases: `.ownProperty`, `.haveOwnProperty`)
- `.string`
- `.keys`
- `.members`
- `.oneOf`
