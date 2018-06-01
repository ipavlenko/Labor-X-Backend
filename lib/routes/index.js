const keystone = require('keystone')

const { initLocals, errorHandler } = require('./middleware')
const blockchainRouter = require('./lib/blockchain')

const restful = require('restful-keystone')(keystone, {
  root: '/api/v1'
})

keystone.pre('routes', initLocals)

exports = module.exports = function (app) {
  app.set('json spaces', 2)

  app.all('/api/v1/*', keystone.middleware.cors)

  app.options('/api/v1/*', (req, res) => {
    res.sendStatus(200)
  })

  app.use('/api/v1/blockchain', blockchainRouter)

  app.get('/', (req, res) => {
    res.redirect('/keystone/')
  })

  restful.expose({
  }).start()

  app.use(errorHandler)
}
