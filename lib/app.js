const path = require('path')
const keystone = require('keystone')
const config = require('config')
const { promisify } = require('util')
const debug = require('debug')('@laborx/platform.backend:app')
const nodemailer = require('nodemailer')

function createApp (options) {
  keystone.init({
    'name': 'LaborX Backend',
    'brand': 'laborx',
    'mongo': config.get('storage.url'),
    'static': ['public'],
    'module root': path.join(__dirname, '../'),
    'auto update': process.env.REST,
    'session': true,
    'auth': true,
    'user model': 'SecurityUser',
    'cookie secret': config.get('keystone.cookieSecret'),
    'cloudinary config': config.get('cloudinary.url'),
    'cloudinary folders': true,
    'file limit': '10MB',
    ...options
  })

  keystone.import('lib/keystone')

  keystone.set('cors allow origin', true)

  keystone.set('routes', require('./routes'))

  keystone.set('nav', {
    security: ['security-users']
  })

  keystone.set('mail transport', nodemailer.createTransport(config.get('mail').transport))
  keystone.set('app-started', false)

  keystone.stopAsync = async function () {
    await promisify(keystone.httpServer.close.bind(keystone.httpServer))()

    const { shutdownServices } = requireRoot('lib/services')
    await shutdownServices()

    const { web3Holder } = requireRoot('lib/web3')
    await web3Holder.shutdown()

    await promisify(keystone.mongoose.connection.close.bind(keystone.mongoose.connection))()

    keystone.set('app-started', false)
  }

  keystone.startAsync = async function () {
    return new Promise(function (resolve, reject) {
      keystone.start(async function () {
        const { web3Holder } = requireRoot('lib/web3')
        await web3Holder.init()

        const { startServices } = requireRoot('lib/services')
        await startServices(keystone)

        debug('Server successfully started')
        keystone.set('app-started', true)

        resolve()
      })
    })
  }
  return keystone
}

exports = module.exports = {
  createApp
}
