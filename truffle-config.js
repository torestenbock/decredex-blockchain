require('@babel/register')
require("regenerator-runtime/runtime")



module.exports = {

  networks: {

    // Run ganache-cli and use this network for dev and testing purposes
    development: {
     host: "127.0.0.1",     // Localhost
     port: 8545,            // Standard Ethereum port
     network_id: "*",       // Any network (default: none)
     gas: 4712388         // Default is 4712388
    }

  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}
