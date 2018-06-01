const config = require('config')
const Web3 = require('web3')
const EventEmitter = require('events')
const debug = require('debug')('@laborx/exchange.backend:Web3Holder')

class Web3Holder extends EventEmitter {
  init () {
    this.isShutdown = false
    const url = config.blockchain.url
    if (url.startsWith('ws')) {
      this._web3 = new Web3(this.createWsProvider(url))
    } else {
      this._web3 = new Web3(new Web3.providers.HttpProvider(url))
    }
    this._faucet = this._web3.eth.accounts.privateKeyToAccount(`0x${config.blockchain.faucet}`)
    setImmediate(() => {
      this.emit('init')
    })
    debug('successfully initialized')
  }

  createWsProvider (url) {
    const provider = new Web3.providers.WebsocketProvider(url)
    provider.on('end', () => {
      debug("web3 provider's connection end")
      if (!this.isShutdown) {
        this._web3.setProvider(this.createWsProvider(url))
        setImmediate(() => {
          this.emit('new provider')
        })
      }
    })
    debug('web3 provider successfully initialized')
    return provider
  }

  shutdown () {
    this.isShutdown = true
    if (this._web3.currentProvider instanceof Web3.providers.WebsocketProvider) {
      this._web3.currentProvider.connection.close()
    }

    setImmediate(() => {
      this.emit('shutdown')
    })
  }

  get web3 () {
    return this._web3
  }

  get faucet () {
    return this._faucet
  }
}

module.exports = Web3Holder
