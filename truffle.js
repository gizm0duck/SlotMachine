// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require("babel-core/register");
require("babel-polyfill");

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '*' // Match any network id
    }
  }
}
