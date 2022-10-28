
// this is simply a bit of glue to let me use es6 import - which i prefer - @anselm apr 2022

require = require("esm")(module)
module.exports = require("./main.js")
