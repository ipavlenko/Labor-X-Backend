const { WebError, ValidationError } = requireRoot('lib/errors')
const errorDebug = require('debug')('@laborx/exchange.backend:middleware')

function asyncHandler (fn) {
  return (...args) => fn(...args).catch(args[2])
}

exports.authenticate = (scopes) => {
  return asyncHandler(async (req, res, next) => {
    next()
  })
}

exports.asyncHandler = asyncHandler

exports.initLocals = function (req, res, next) {
  // res.locals.user = req.user
  next()
}

// Forced to have 4 arguments due to express convension about error handlers
// eslint-disable-next-line
exports.errorHandler = function (err, req, res, next) {
  // eslint-disable-next-line
  errorDebug(err)
  let status = 500
  if (err instanceof WebError) {
    status = err.status
  } else if (err instanceof ValidationError) {
    status = 400
  }
  res.status(status).send({ error: err.message })
}
