const BigNumber = require('bignumber.js')
const { web3Holder } = requireRoot('lib/web3')
const debug = require('debug')('@laborx/platform.backend:FaucetService')

class FaucetService {
  async borrow ({ address, amount }) {
    debug(`Borrow ${amount} LHT on ${address}`)
    const { rawTransaction } = await web3Holder.faucet.signTransaction({
      from: web3Holder.faucet.address,
      to: address,
      value: amount,
      gas: new BigNumber(2000000)
    })
    return web3Holder.web3.eth.sendSignedTransaction(rawTransaction)
  }
}

module.exports = FaucetService
