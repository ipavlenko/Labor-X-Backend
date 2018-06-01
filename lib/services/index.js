const FaucetService = require('./lib/FaucetService')

const faucetService = new FaucetService()

module.exports = {
  faucetService,
  async startServices (keystone) {
  },
  async shutdownServices () {
  }
}
